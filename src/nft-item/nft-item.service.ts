import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chains } from 'src/chains/entities/chains.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { Not, Repository } from 'typeorm';
import { FilterDto } from './dto/filter.dto';
import { CreateNftItemDto } from './dto/nft-item.dto';
import { UpdateNftItemDto } from './dto/update.nftItem.dto';
import { NftItem } from './entities/nft-item.entities';
import { Between } from 'typeorm';
import { Constants } from 'shared/Constants';
import { User } from 'src/user/entities/user.entity';
import { ResponseMessage } from 'shared/ResponseMessage';
import { TransferItemDto } from './dto/transferItem.dto';
import { ActivityService } from 'src/activity/activity.service';
import { eventType, eventActions } from '../../shared/Constants';
import { FilterDtoAllItems } from './dto/filter-Dto-All-items';
import moment from 'moment';
import { fetchTransactionReceipt } from 'shared/contract-instance';
import { UpdateCashbackDto } from './dto/updatecashback.dto';
import coingecko from 'coingecko-api';
import { Auction } from 'src/auctions/entities/auctions.entity';

@Injectable()
export class NftItemService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(NftItem)
    private readonly nftItemRepository: Repository<NftItem>,
    @InjectRepository(Chains)
    private chainsRepository: Repository<Chains>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
    private readonly activityService: ActivityService,
  ) {}

  /**
   * @description: This api will create the item and returns updated item from database
   * @param NftItemDto
   * @param user
   * @returns: create Item
   * @author: vipin
   */
  async createNftItem(user, nftItemDto: CreateNftItemDto): Promise<any> {
    try {
      const nftItem = new NftItem();

      nftItem.walletAddress = user.walletAddress;
      nftItem.originalOwner = user.walletAddress;
      nftItem.owner = user.walletAddress;
      nftItem.description = nftItemDto.description;

      const chains = await this.chainsRepository.findOne({
        where: { id: nftItemDto.blockChainId },
      });
      nftItem.blockChain = chains;

      nftItem.isExplicit = nftItemDto.isExplicit;
      nftItem.externalUrl = nftItemDto.externalUrl;
      nftItem.fileUrl = nftItemDto.fileUrl;
      nftItem.levels = nftItemDto.levels;
      nftItem.properties = nftItemDto.properties;
      nftItem.stats = nftItemDto.stats;
      nftItem.supply = nftItemDto.supply;
      nftItem.isLockable = nftItemDto.isLockable;
      nftItem.lockableContent = nftItemDto.lockableContent;
      nftItem.fileName = nftItemDto.fileName;
      nftItem.timeStamp = Date.now();
      nftItem.previewImage = nftItemDto.previewImage;
      nftItem.contractAddress = nftItemDto.contractAddress;

      const [index, indexCount] = await this.nftItemRepository.findAndCount({
        walletAddress: user.walletAddress,
      });
      if (!nftItemDto.supply) nftItemDto.supply = 1;
      nftItem.tokenId = await this.generateToken(
        user.walletAddress,
        indexCount + 1,
        nftItemDto.supply,
      );

      if (!nftItemDto.collectionId) {
        const userCreated = await this.userRepository.findOne({
          where: {
            walletAddress: user.walletAddress,
          },
        });

        const collection = await this.collectionRepository.find({
          where: {
            owner: userCreated.id,
          },
        });

        if (collection.length) {
          return false;
        } else {
          const collections = (await this.collectionRepository.count()) + 1;
          let collection = new Collection();

          collection.logo = Constants.COLLECTION_LOGO;
          collection.name = `${Constants.COLLECTION_NAME}#${collections}`;
          collection.owner = userCreated;
          collection.ownerWalletAddress = user.walletAddress;

          collection = await this.collectionRepository.save(collection);

          nftItem.collection = collection;
        }
      } else {
        const collection = await this.collectionRepository.findOne({
          where: { id: nftItemDto.collectionId },
        });
        nftItem.collection = collection;
      }

      const data = await this.nftItemRepository.save(nftItem);

      if (data) return data;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  /**
   * @description: This api fetch item and returns status
   * @param FilterDto
   * @returns: fetch Item with filters
   * @author: vipin
   */
  async fetchNftItems(filterDto: FilterDto): Promise<any> {
    try {
      const {
        walletAddress,
        collectionsId,
        chainsId,
        categories,
        priceType,
        status,
        priceRange,
        onSale,
        limit,
        page,
        order,
      } = filterDto;

      const take = limit ? limit : 0;
      const skip = page ? page : 0;

      let item = await this.nftItemRepository.createQueryBuilder('item');

      item = await item.where('item.walletAddress = :walletAddress', {
        walletAddress,
      });

      item = await item.leftJoinAndSelect('item.auction_item', 'auction_item');

      // if (walletAddress) {
      // item = await item.where('item.walletAddress = :walletAddress', {
      //   walletAddress,
      // });
      // }

      if (collectionsId) {
        const collectionIdArray = collectionsId.split(',').map((s) => s.trim());

        item = await item.leftJoinAndSelect(
          'item.collection',
          'collection',
          'collection.id IN (:...collectionIdArray)',
          { collectionIdArray },
        );
      }

      if (onSale) {
        const tokens = onSale.split(',').map((s) => s.trim());
        item = await item
          .leftJoinAndSelect('auction_item.tokens', 'tokens')
          .andWhere('tokens.id IN (:...tokens)', { tokens });
      }

      if (priceRange) {
        const [min1, max1] = priceRange.split(',').map((s) => s.trim());
        let min = parseInt(min1);
        let max = parseInt(max1);

        // const price = await this.utilsService.getLivePrice('eth', 'usd');
        if (priceType == 'usd') {
          const coin = new coingecko();
          const price = await coin.simple.price({
            ids: 'ethereum',
            vs_currencies: 'usd',
          });
          min = min * (1 / price.data.ethereum.usd);
          max = max * (1 / price.data.ethereum.usd);
        }

        item = await item.andWhere(
          'auction_item.startingPrice BETWEEN :min AND :max',
          {
            min,
            max,
          },
        );
      }

      if (categories) {
        item = await item
          .leftJoinAndSelect('item.collection', 'collection')
          .andWhere('collection.categoryId = :categoryId', {
            categoryId: categories,
          });
      }

      if (chainsId) {
        const chainId = chainsId.split(',').map((s) => s.trim());
        item = await item.leftJoinAndSelect(
          'item.blockChain',
          'blockChain',
          'blockChain.id IN (:...chainId)',
          { chainId },
        );
      }

      if (status) {
        const statusArr = status.split(',').map((s) => s.trim());

        if (statusArr.includes('new')) {
          const time = Date.now() - 1000 * 60 * 60 * 24 * 1;
          item = item.andWhere('item.timeStamp > :time', {
            time,
          });
        }

        if (statusArr.includes('buynow')) {
          item = await item.andWhere('item.buyNow = :buyNow', { buyNow: true });
        }

        if (statusArr.includes('onAuction')) {
          item = await item.andWhere('item.onAuction = :onAuction', {
            onAuction: true,
          });
        }

        if (statusArr.includes('hasCashback')) {
          item = await item.andWhere('item.onAuction = :hasCashback', {
            hasCashback: true,
          });
        }

        if (statusArr.includes('hasOffer')) {
          item = await item.andWhere('item.hasOffer = :hasOffer', {
            hasOffer: true,
          });
        }
      }

      switch (order) {
        case 'recentlyCreated':
          item.orderBy('item.createdAt', 'DESC');
          break;
        case 'oldest':
          item.orderBy('item.createdAt', 'ASC');
          break;
        case 'endDate':
          item.orderBy('auction_item.endDate', 'ASC');
          break;
        case 'endingSoon':
          item.orderBy('auction_item.endDate', 'ASC');
          break;
        case 'priceL2H':
          item.orderBy('auction_item.startingPrice', 'ASC');
          break;
        case 'priceH2L':
          item.orderBy('auction_item.startingPrice', 'DESC');
          break;
        case 'recentlyListed':
          item.orderBy('auction_item.createdAt', 'DESC');
          break;

        default:
          item.orderBy('item.id', 'ASC');
      }
      return item
        .skip((skip - 1) * take)
        .take(take)
        .getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description: This api updates the item and returns status
   * @param id
   * @param UpdateNftItemDto
   * @returns: Update Item
   * @author: vipin
   */
  async updateNftItems(
    id: string,
    updateNftItemDto: UpdateNftItemDto,
  ): Promise<any> {
    try {
      const updateNftItem = new NftItem();
      updateNftItem.description = updateNftItemDto.description;
      updateNftItem.externalUrl = updateNftItemDto.externalUrl;
      updateNftItem.fileName = updateNftItemDto.fileName;
      updateNftItem.fileUrl = updateNftItemDto.fileUrl;
      updateNftItem.isExplicit = updateNftItemDto.isExplicit;
      updateNftItem.isLockable = updateNftItemDto.isLockable;
      updateNftItem.levels = updateNftItemDto.levels;
      updateNftItem.lockableContent = updateNftItemDto.lockableContent;
      updateNftItem.properties = updateNftItemDto.properties;
      updateNftItem.stats = updateNftItemDto.stats;
      updateNftItem.isFreezed = updateNftItemDto.isFreezed;
      const collection = await this.collectionRepository.findOne({
        where: { id: updateNftItemDto.collectionId },
      });
      updateNftItem.collection = collection;
      updateNftItem.previewImage = updateNftItemDto.previewImage;

      const update = await this.nftItemRepository.update({ id }, updateNftItem);
      if (update) return update;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const item = await this.nftItemRepository.findOne({ id });
      if (item) return item;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * @description Creates unique tokenId for an item
   * @param walletAddress walletAdrress is in HEX
   * @param index should be in integer
   * @param supply integer
   * @returns generateToken("0x287A135702555F69BA6eE961f69ee60Fbb87A0f8", 2, 123);
   * expected output
   *  18308202764175312363921158875842719186563004225019719481464309476731798945915
   *
   * @author mohan
   */
  async generateToken(
    walletAddress: string,
    index: number,
    supply: number,
  ): Promise<string> {
    // walletAddrress to binary
    const binaryWalletaddress = BigInt(walletAddress)
      .toString(2)
      .padStart(160, '0');

    //Index to binary
    const binaryIndex = index.toString(2).padStart(56, '0');

    //Supply to binary
    const binarySupply = supply.toString(2).padStart(40, '0');

    //joining walletaddress + Index + Supply
    const binaryToken = binaryWalletaddress + binaryIndex + binarySupply;

    //console.log(binaryToken);

    const decimalToken = BigInt('0b' + binaryToken);

    return decimalToken.toString();
  }

  /**
   * @description Function will add current user to the item favourites
   * @param walletAddress , wallet address of the current user
   * @param itemId , item id to perform the update
   * @returns Promise
   * @author Jeetanshu Srivastava
   */
  async addUserInFavourites(
    walletAddress: string,
    itemId: string,
  ): Promise<boolean> {
    try {
      const item = await this.nftItemRepository.findOne({
        where: { id: itemId },
        relations: ['favourites'],
      });
      if (!item) return null;

      const user = await this.userRepository.findOne({
        where: {
          walletAddress,
        },
      });
      if (!user) return null;

      if (item.favourites) {
        item.favourites.push(user);
      } else {
        item.favourites = [user];
      }

      await this.nftItemRepository.save(item);

      return true;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @description Function will remove current user to the item favourites
   * @param walletAddress , wallet address of the current user
   * @param itemId , collecton id to perform the update
   * @returns Promise
   * @author Jeetanshu Srivastava
   */
  async removeUseFromFavourites(
    walletAddress: string,
    itemId: string,
  ): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          walletAddress: walletAddress,
        },
      });
      if (!user) return null;

      await this.nftItemRepository
        .createQueryBuilder()
        .relation(NftItem, 'favourites')
        .of(itemId)
        .remove(user.id);

      return true;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description: getItemForUserFavourites returns the items present in current user favourites
   * @returns: Items
   * @author: Jeetanshu Srivastava
   */
  async getItemForUserFavourites(walletAddress: string): Promise<NftItem[]> {
    try {
      const itemsId = await this.nftItemRepository
        .createQueryBuilder('items')
        .innerJoinAndSelect('items.favourites', 'favourites')
        .where('favourites.walletAddress = :walletAddress', { walletAddress })
        .select(['items.id'])
        .getMany();

      const id = [];
      for (let i = 0; i < itemsId.length; i++) {
        id.push(itemsId[i].id);
      }

      let items: any = [];

      if (id.length) {
        items = await this.nftItemRepository
          .createQueryBuilder('items')
          .where('items.id IN (:...id)', { id })
          .innerJoinAndSelect('items.favourites', 'favourites')
          .innerJoinAndSelect('items.collection', 'collection')
          .leftJoinAndSelect('collection.owner', 'owner')
          .innerJoinAndSelect('items.blockChain', 'blockChain')
          .select(['items', 'collection', 'owner', 'blockChain', 'favourites'])
          .getMany();
      }

      return items;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /**
   * @description getItemFavouritesCount returns the number of favourites for item
   * @param itemId
   * @returns number of favourites for item
   * @author Jeetanshu Srivastava
   */
  async getItemFavouritesCount(itemId: string): Promise<number> {
    try {
      const item = await this.nftItemRepository
        .createQueryBuilder('items')
        .leftJoinAndSelect('items.favourites', 'favourites')
        .where('items.id = :itemId', { itemId })
        .getOne();

      return item.favourites.length;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /* @description: This api for count the viewer of nft Item
   * @param: id
   * @returns: viewer count
   * @author: Susmita
   */
  async updateViewerCount(id: string): Promise<any> {
    try {
      const item = await this.findOne(id);
      if (item) {
        item.views = item.views + 1;
        await this.nftItemRepository.update({ id }, item);
        return item;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description: This api fetch all the item of a collection except one
   * @param id
   * @returns: all Item from a collection
   * @author: vipin
   */
  async findAllItemExceptOne(id: string): Promise<any> {
    try {
      const item = await this.nftItemRepository.find({
        where: { id },
        relations: ['collection'],
      });
      if (!item.length)
        throw new NotFoundException(ResponseMessage.ITEM_NOT_FOUND);

      const data = await this.nftItemRepository.find({
        where: { id: Not(id), collection: item[0].collection.id },
        relations: ['collection'],
      });
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /**
   * @description: This api delete an item
   * @param id
   * @returns: status and message
   * @author: vipin
   */
  async deleteItem(id: string, hash: string): Promise<any> {
    try {
      const receipt = await fetchTransactionReceipt(hash);
      if (receipt.status === true) {
        await this.nftItemRepository.softDelete({ id });
        return ResponseMessage.ITEM_DELETED;
      } else {
        throw new BadRequestException(
          ResponseMessage.ITEM_DELETE_BLOCKCHAIN_ERROR,
        );
      }
    } catch (error) {
      return error;
    }
  }

  /**
   * @description: This api transfer a item to other user
   * @param id
   * @returns: status and message
   * @author: vipin
   */
  async transferItem(
    id: string,
    transferDto: TransferItemDto,
    item,
  ): Promise<any> {
    try {
      if (item.supply - transferDto.supply < 0) {
        return {
          success: false,
          status: HttpStatus.BAD_REQUEST,
          message: ResponseMessage.SUPPLY_ERROR,
        };
      }
      //--  code to transfer item blockchain from one user to another user
      const receipt = await fetchTransactionReceipt(transferDto.hash);

      if (receipt.status == true) {
        const transferNftItem = new NftItem();
        transferNftItem.owner = transferDto.userWalletAddress;
        transferNftItem.supply = item.supply - transferDto.supply;
        transferNftItem.hash = transferDto.hash;
        transferNftItem.onAuction = false;
        const itemDetails = await this.nftItemRepository.update(
          { id },
          transferNftItem,
        );

        await this.activityService.createActivity({
          eventActions: eventActions.TRANSFER,
          nftItem: item.id,
          eventType: eventType.TRANSFERS,
          fromAccount: item.owner,
          toAccount: transferDto.userWalletAddress,
          totalPrice: null,
          isPrivate: false,
          collectionId: item.collection.id,
          winnerAccount: null,
        });

        return ResponseMessage.ITEM_TRANSFERED;
      } else {
        throw new BadRequestException(
          ResponseMessage.ITEM_TRANSFER_BLOCKCHAIN_ERROR,
        );
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  /**
   * @description function to retrieve all items based on filters
   * @param filterDtoAllItems
   * @returns filtered array of
   * @author Mohan
   */

  async getAllItems1(filterDtoAllItems: FilterDtoAllItems): Promise<NftItem[]> {
    try {
      const {
        collectionsId,
        chainsId,
        categories,
        priceType,
        status,
        paymentTokens,
        isBundle,
        priceRange,
        order,
      } = filterDtoAllItems;

      let { take, skip } = filterDtoAllItems;

      take = take ? take : 0;
      skip = skip ? skip : 0;

      let item = await this.nftItemRepository.createQueryBuilder('item');

      //  item = await item.innerJoinAndSelect('item.auction_item', 'auction_item');
      item = await item.leftJoinAndSelect('item.auction_item', 'auction_item');
      item = await item.innerJoinAndSelect('item.collection', 'collection');
      item = await item.leftJoinAndSelect('item.blockChain', 'blockChain');
      item = await item.leftJoinAndSelect('item.favourites', 'favourites');

      if (collectionsId) {
        const collectionIdArray = collectionsId.split(',').map((s) => s.trim());
        console.log(collectionIdArray);

        item = await item.andWhere('collection.id IN (:...collectionIdArray)', {
          collectionIdArray,
        });
      }
      if (paymentTokens) {
        const tokens = paymentTokens.split(',').map((s) => s.trim());

        item = await item
          .leftJoinAndSelect('auction_item.tokens', 'tokens')
          .andWhere('tokens.symbol IN (:...tokens)', { tokens });
      }

      // if (isBundle) {
      //   item = await item.andWhere('auction_item.bundle = :isBundle', {
      //     isBundle: true,
      //   });
      // }

      if (priceRange) {
        const [min1, max1] = priceRange.split(',').map((s) => s.trim());
        let min = parseInt(min1);
        let max = parseInt(max1);
        console.log(priceType);

        if (priceType == 'usd') {
          const coin = new coingecko();

          const price = await coin.simple.price({
            ids: 'ethereum',
            vs_currencies: 'usd',
          });
          console.log(price);

          min = min * (1 / price.data.ethereum.usd);
          max = max * (1 / price.data.ethereum.usd);
        }
        item = await item.andWhere(
          'auction_item.startingPrice BETWEEN :min AND :max',
          {
            min,
            max,
          },
        );
      }

      if (categories) {
        item = await item
          //     .leftJoinAndSelect('item.collection', 'collection')
          .andWhere('collection.categoryId = :categoryId', {
            categoryId: categories,
          });
      }

      if (chainsId) {
        const chainId = chainsId.split(',').map((s) => s.trim());
        item = await item.andWhere('blockChain.id IN (:...chainId)', {
          chainId,
        });
      }

      if (status) {
        const statusArr = status.split(',').map((s) => s.trim());

        if (statusArr.includes('new')) {
          // const timeStamp = moment()
          //   .subtract(10, 'd')
          //   .format('YYYY-MM-DD HH:MM:SS.SSSSSS');
          //   console.log(timeStamp, moment().format('YYYY-MM-DD HH:MM:SS.SSSSSS'));
          const time = Date.now() - 1000 * 60 * 60 * 24 * 1;

          item = item.andWhere('item.timeStamp > :time', {
            time,
          });
        }

        if (statusArr.includes('buynow')) {
          item = await item.andWhere('item.buyNow = :buyNow', { buyNow: true });
        }

        if (statusArr.includes('onAuction')) {
          item = await item.andWhere('item.onAuction = :onAuction', {
            onAuction: true,
          });
        }
        if (statusArr.includes('hasOffer')) {
          item = await item.andWhere('item.hasOffer = :hasOffer', {
            hasOffer: true,
          });
        }
        if (statusArr.includes('hasCashback')) {
          item = await item.andWhere('item.hasCashback = :hasCashback', {
            hasCashback: true,
          });
        }
      }

      switch (order) {
        case 'recentlyCreated':
          item.orderBy('item.createdAt', 'DESC');
          break;
        case 'oldest':
          item.orderBy('item.createdAt', 'ASC');
          break;

        case 'endingSoon':
          item.orderBy('auction_item.endDate', 'ASC');
          break;
        case 'priceL2H':
          item.orderBy('auction_item.startingPrice', 'ASC');
          break;
        case 'priceH2L':
          item.orderBy('auction_item.startingPrice', 'DESC');
          break;
        // case 'HighestLastSale':
        //   item.orderBy('auction_item.endingPrice', 'DESC');
        //   break;
        // case 'recentlySold':
        //   item.orderBy('auction_item.', 'DESC');
        //   break;
        // case 'recentlyReceived':
        //   item.orderBy();
        //   break;
        case 'recentlyListed':
          item.orderBy('auction_item.createdAt', 'DESC');
          break;

        default:
          item.orderBy('item.id', 'ASC');
      }

      return item

        .skip((skip - 1) * take)
        .take(take)
        .getMany();

      // if (isBundle) {
      //   for (let i = 0; i < data.length; i++) {
      //     for (let j = 0; j < data[i].auction_item.length; j++) {
      //       if (
      //         data[i].auction_item[j] &&
      //         data[i].auction_item[j].bundle.isBundle == true
      //       ) {
      //         if (arr.includes(data[i])) break;
      //         arr.push(data[i]);
      //       }
      //     }
      //   }
      // }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description to update item for chashback
   * @param :UpdateCashbackDto
   * @returns: updated item after adding cashback
   * @author: susmita
   */

  async updateCashback(updateCashbackDto: UpdateCashbackDto): Promise<any> {
    try {
      const item = await this.findOne(updateCashbackDto.itemID);
      if (item) {
        item.cashback = updateCashbackDto.cashback;
        item.hasCashback = true;
        await this.nftItemRepository.update(
          { id: updateCashbackDto.itemID },
          item,
        );
        return item;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description: hidden adds or removes item from user hidden items
   * @param itemId
   * @param isHidden
   * @returns: Updates Status
   * @author Jeetanshu Srivastava
   */
  async hideItem(
    itemId: string,
    isHidden: boolean,
    walletAddress: string,
  ): Promise<boolean> {
    const item = await this.nftItemRepository.findOne({ id: itemId });
    if (!item) return null;
    if (item.owner == walletAddress) {
      await this.nftItemRepository.update({ id: itemId }, { isHidden });
      return true;
    }
    return null;
  }

  /**
   * @description: getHiddenItems for current user
   * @param walletAddress
   * @returns: Updates Status
   * @author Jeetanshu Srivastava
   */
  async getHiddenItems(walletAddress: string): Promise<NftItem[]> {
    const items = await this.nftItemRepository.find({
      where: {
        walletAddress,
        isHidden: true,
      },
    });
    return items;
  }
}
