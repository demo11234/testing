import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { auctionType, timedAuctionMethod } from 'shared/Constants';
import { Collection } from 'src/collections/entities/collection.entity';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
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
  async getAuctionsByUserId(walletAddress: string): Promise<Auction[]> {
    const user = await this.userRepository.findOne({ walletAddress });
    const userId = user.id;
    console.log(userId);
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
}
