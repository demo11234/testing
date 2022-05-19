import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chains } from 'src/chains/entities/chains.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { In, Not, Repository } from 'typeorm';
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
import { fetchTransactionReceipt } from 'shared/contract-instance';
import { BadRequestException } from '@nestjs/common';
import { UpdateCashbackDto } from './dto/updatecashback.dto';

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
        sortBy,
        limit,
        page,
        order: orderBy,
      } = filterDto;

      const where: any = { walletAddress };

      if (collectionsId) {
        const collectionId = collectionsId.split(',').map((s) => s.trim());
        where.collection = { id: In(collectionId) };
      }

      if (chainsId) {
        const chainId = chainsId.split(',').map((s) => s.trim());
        where.blockChain = { id: In(chainId) };
      }

      if (status) {
        const statusArr = status.split(',').map((s) => s.trim());

        if (statusArr.includes('new')) {
          const BetweenDates = () =>
            Between(Date.now() - 1000 * 60 * 60 * 24 * 1, Date.now());
          where.timeStamp = BetweenDates();
        }
        if (statusArr.includes('buynow')) {
          where.buyNow = true;
        }
        if (statusArr.includes('onAuction')) {
          where.onAuction = true;
        }
        if (statusArr.includes('hasOffer')) {
          where.hasOffer = true;
        }
        if (statusArr.includes('hasCashback')) {
          where.hasCashback = true;
        }
      }

      if (categories) {
        where.collection = { categoryID: categories };
      }

      if (onSale) {
        const tokenArr = onSale.split(',').map((s) => s.trim());
        where.allowedTokens = In(tokenArr);
      }

      // if(priceRange){
      //     const priceValue = priceRange.split(',').map(s=>s.trim())
      //     where.blockChain = priceRange  ? { usdPrice: Between(priceValue[0], priceValue[1]) } : where;
      // }

      const order = {};
      if (sortBy === 'date') {
        switch (orderBy) {
          case 'asc':
            order['createdAt'] = 'ASC';
            break;
          case 'desc':
            order['createdAt'] = 'DESC';
            break;
          default:
            order['id'] = 'ASC';
        }
      }

      const data = await this.nftItemRepository.find({
        where,
        order,
        relations: ['collection', 'blockChain', 'favourites'],
        skip: (+page - 1) * +limit,
        take: +limit,
      });
      return data;
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
      updateNftItem.isFreezed = updateNftItem.isFreezed;
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

  /* @description: This api fetch all the item of a collection except one
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

      if (receipt.status === true) {
        const transferNftItem = new NftItem();
        transferNftItem.owner = transferDto.userWalletAddress;
        transferNftItem.supply = item.supply - transferDto.supply;
        transferNftItem.hash = transferDto.hash;
        await this.nftItemRepository.update({ id }, transferNftItem);

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
  async getAllItems(filterDtoAllItems: FilterDtoAllItems): Promise<NftItem[]> {
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
        sortBy,
        limit,
        page,
        order: orderBy,
      } = filterDtoAllItems;

      const where: any = {};

      if (collectionsId) {
        const collectionId = collectionsId.split(',').map((s) => s.trim());
        where.collection = { id: In(collectionId) };
      }

      if (categories) {
        where.collection = { categoryID: categories };
      }

      if (chainsId) {
        const chainId = chainsId.split(',').map((s) => s.trim());
        where.blockChain = { id: In(chainId) };
      }

      if (status) {
        const statusArr = status.split(',').map((s) => s.trim());

        if (statusArr.includes('new')) {
          const BetweenDates = () =>
            Between(Date.now() - 1000 * 60 * 60 * 24 * 1, Date.now());
          where.timeStamp = BetweenDates();
        }

        // const timeStamp = moment()
        //   .subtract(4, 'h')
        //   .format('YYYY-MM-DD HH:MM:SS.SSSSSS');
        // where.createdAt = MoreThan(timeStamp);

        if (statusArr.includes('buynow')) {
          where.buyNow = true;
        }

        if (statusArr.includes('onAuction')) {
          where.onAuction = true;
        }

        if (statusArr.includes('hasOffer')) {
          where.hasOffer = true;
        }

        if (statusArr.includes('hasCashback')) {
          where.hasCashback = true;
        }
      }

      //make relation with Auction first

      // if (paymentTokens) {
      //   const tokens = paymentTokens.split(',').map((s) => s.trim());
      //   console.log(tokens);
      //   //  .where("post.authorId IN (:...authors)", { authors: [3, 7, 9] })
      //   // (where.auction_item = 'auction_item IN (:...auction_item)'),
      //   //   { tokens: In(tokens) };
      //     where.auction_item  = { tokens: { name: In(tokens) } };
      // }

      const order = {};
      if (sortBy === 'date') {
        switch (orderBy) {
          case 'asc':
            order['createdAt'] = 'ASC';
            break;
          case 'desc':
            order['createdAt'] = 'DESC';
            break;
          default:
            order['id'] = 'ASC';
        }
      }

      const data = await this.nftItemRepository.find({
        where,
        order,
        relations: ['collection', 'blockChain', 'auction_item'],
        skip: (+page - 1) * +limit,
        take: +limit,
      });

      const arr: any = [];
      if (priceRange) {
        const priceValue = priceRange.split(',').map((s) => s.trim());

        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].auction_item.length; j++) {
            if (
              data[i].auction_item[j].startingPrice >=
                parseInt(priceValue[0]) &&
              data[i].auction_item[j].startingPrice <= parseInt(priceValue[1])
            ) {
              arr.push(data[i]);
            }
          }
        }
      }

      //if it is a bundle
      if (isBundle) {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].auction_item.length; j++) {
            if (
              data[i].auction_item[j] &&
              data[i].auction_item[j].bundle.isBundle == true
            ) {
              if (arr.includes(data[i])) break;
              arr.push(data[i]);
            }
          }
        }
      }
      //for payment Tokens

      if (paymentTokens) {
        const tokens = paymentTokens.split(',').map((s) => s.trim());

        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].auction_item.length; j++) {
            console.log(data[i].auction_item[j].tokens.symbol);
            if (
              data[i].auction_item[j].tokens.symbol &&
              tokens.includes(data[i].auction_item[j].tokens.symbol)
            ) {
              if (arr.includes(data[i])) break;
              arr.push(data[i]);
            }
          }
        }
      }
      if (arr.length > 0) return arr;
      else return data;
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
        await this.nftItemRepository.update(
          { id: updateCashbackDto.itemID },
          item,
        );
        return item;
      }
    } catch (error) {
      throw new Error(error);
    }

  /**
   * @description: hidden adds or removes item from user hidden items
   * @param itemId
   * @param isExplicit
   * @returns: Updates Status
   * @author Jeetanshu Srivastava
   */
  async hideItem(
    itemId: string,
    isExplicit: boolean,
    walletAddress: string,
  ): Promise<boolean> {
    const item = await this.nftItemRepository.findOne({ id: itemId });
    if (!item) return null;
    if (item.owner == walletAddress) {
      await this.nftItemRepository.update({ id: itemId }, { isExplicit });
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
        isExplicit: true,
      },
    });
    return items;
  }
}
