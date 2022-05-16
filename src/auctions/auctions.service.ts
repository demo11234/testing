import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  auctionType,
  eventActions,
  eventType,
  timedAuctionMethod,
} from 'shared/Constants';
import { ResponseMessage } from 'shared/ResponseMessage';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { ActivityService } from 'src/activity/activity.service';
import { Collection } from 'src/collections/entities/collection.entity';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { Offer } from 'src/offer/entities/offer.entity';
import { Tokens } from 'src/token/entities/tokens.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Auction } from './entities/auctions.entity';
import { CreateAuctionInterface } from './interface/create-auction.interface';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
    @InjectRepository(Tokens) private tokensRepository: Repository<Tokens>,
    @InjectRepository(NftItem) private nftItemRepository: Repository<NftItem>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    private readonly activityService: ActivityService,
  ) {}

  /**
   * @description createAuction will create new auction
   * @param CreateAuctionInterface
   * @returns it will return created chain details
   * @author Jeetanshu Srivastava
   */
  async createAuctions(
    createAuctionInterface: CreateAuctionInterface,
    walletAddress: string,
  ): Promise<Auction> {
    const auction = new Auction();

    auction.auctionType = createAuctionInterface.auctionType;
    auction.startDate = createAuctionInterface.startDate;
    auction.endDate = createAuctionInterface.endDate;
    auction.quantity = createAuctionInterface.quantity
      ? createAuctionInterface.quantity
      : 0;

    const user = await this.userRepository.findOne({ walletAddress });
    auction.creator = user;

    const token = await this.tokensRepository.findOne({
      id: createAuctionInterface.tokens,
    });
    auction.tokens = token;

    const item = await this.nftItemRepository.findOne({
      id: createAuctionInterface.auction_items,
    });
    auction.auction_item = item;
    auction.auctionName = item.fileName;

    const collection = await this.collectionRepository.findOne({
      id: createAuctionInterface.auction_collection,
    });
    auction.auction_collection = collection;

    if (createAuctionInterface.auctionType == auctionType.FIXED_PRICE) {
      auction.price = createAuctionInterface.price;
      if (createAuctionInterface.bundle) {
        auction.bundle = createAuctionInterface.bundle;
        auction.auctionName = createAuctionInterface.bundle.name;
      }
      auction.reservedAuction = createAuctionInterface.reservedAuction;
    } else if (
      createAuctionInterface.auctionType == auctionType.TIMED_AUCTION
    ) {
      auction.startingPrice = createAuctionInterface.startingPrice;
      auction.timedAuctionMethod = createAuctionInterface.timedAuctionMethod;
      if (
        createAuctionInterface.timedAuctionMethod ==
        timedAuctionMethod.SELL_TO_HIGHEST_BIDDER
      ) {
        auction.reservedPrice = createAuctionInterface.reservedPrice;
      } else if (
        createAuctionInterface.timedAuctionMethod ==
        timedAuctionMethod.SELL_WITH_DECLINING_PRICE
      ) {
        auction.endingPrice = createAuctionInterface.endingPrice;
      }
    }

    return this.auctionRepository.save(auction);
  }

  /**
   * @description getAuctionByUserId will return auction details for given user id
   * @param userId
   * @returns it will return auction with given user id
   * @author Jeetanshu Srivastava
   */
  async getAuctionsByUserId(userId: string): Promise<Auction[]> {
    const auctions = await this.auctionRepository
      .createQueryBuilder('auctions')
      .innerJoinAndSelect('auctions.creator', 'creator')
      .where('creator.id = :userId', {
        userId,
      })
      .select(['auctions'])
      .getMany();
    return auctions;
  }

  /**
   * @description getAuctionByAuctionId will return auction details for given auction id
   * @param auctionId
   * @returns it will return auction details with given auction id
   * @author Jeetanshu Srivastava
   */
  async getAuctionDetailsByAuctionId(auctionId: string): Promise<Auction> {
    const auctions = await this.auctionRepository.findOne({
      where: {
        id: auctionId,
      },
    });
    return auctions;
  }

  /**
   * @description getAuctionDetails will return auction details for given auction id
   * @param auctionId
   * @returns it will return auction details with given auction id
   * @author Jeetanshu Srivastava
   */
  async getAuctionDetails(auctionId: string): Promise<Auction> {
    const auctions = await this.auctionRepository.findOne({
      where: {
        id: auctionId,
      },
      relations: ['creator', 'auction_item', 'auction_collection'],
    });
    return auctions;
  }

  /**
   * @description cancelListing will cancel the listing of the given auction Id
   * @param auctionId
   * @returns it will return boolean value 'true' for successful Listing Cancellation
   * @author Jeetanshu Srivastava
   */
  async cancelListing(auctionId: string, walletAddress: string): Promise<any> {
    const auction = await this.getAuctionDetails(auctionId);
    if (auction.creator.walletAddress != walletAddress) {
      return {
        message: ResponseMessage.UNAUTHORIZED,
        status: ResponseStatusCode.BAD_REQUEST,
        success: false,
      };
    }
    if (auction.isActive && !auction.isCancelled) {
      await this.auctionRepository.update(
        { id: auctionId },
        { isActive: false, isCancelled: true },
      );

      const itemId = auction.auction_item.id;

      await this.offerRepository
        .createQueryBuilder('offer')
        .innerJoinAndSelect('offer.item', 'item')
        .update(Offer)
        .where('item.id = :itemId', { itemId })
        .set({ isDeleted: true })
        .execute();

      await this.activityService.createActivity({
        eventActions: eventActions.CANCELLED,
        nftItem: auction.auction_item.id,
        eventType: eventType.TRANSFERS,
        fromAccount: auction.creator.walletAddress,
        toAccount: null,
        totalPrice: null,
        isPrivate: false,
        collectionId: auction.auction_collection.id,
        winnerAccount: null,
      });

      return {
        message: ResponseMessage.AUCTION_CANCELLED,
        status: ResponseStatusCode.OK,
        success: true,
      };
    }
    return {
      message: ResponseMessage.AUCTION_CANNOT_BE_CANCELLED,
      status: ResponseStatusCode.BAD_REQUEST,
      success: false,
    };
  }

  /**
   * @description getListingByItemId will return the details of the listing of the given item id
   * @param itemId
   * @returns it will return Array of Listings
   * @author Jeetanshu Srivastava
   */
  async getListingByItemId(itemId: string): Promise<Auction[]> {
    const auctions = await this.auctionRepository
      .createQueryBuilder('auctions')
      .innerJoinAndSelect(
        'auctions.auction_item',
        'nft_item',
        'nft_item.id = :itemId',
        { itemId },
      )
      .getMany();

    return auctions;
  }
}
