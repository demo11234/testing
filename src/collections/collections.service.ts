import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionsDto } from './dto/create-collections.dto';
import { UpdateCollectionsDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { FilterDto } from './dto/filter.dto';
import { ResponseMessage } from 'shared/ResponseMessage';
import { User } from '../../src/user/entities/user.entity';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
// import { UserRepository } from 'src/user/repositories/user.repository';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    walletAddress: string,
    createCollectionDto: CreateCollectionsDto,
  ) {
    try {
      let collection = new Collection();
      collection.logo = createCollectionDto.logo;
      collection.featureImage = createCollectionDto.featureImage;
      collection.banner = createCollectionDto.banner;
      collection.name = createCollectionDto.name;
      collection.url = createCollectionDto.url;
      collection.description = createCollectionDto.description;
      collection.websiteLink = createCollectionDto.websiteLink;
      collection.categoryId = createCollectionDto.categoryId;
      collection.discordLink = createCollectionDto.discordLink;
      collection.instagramLink = createCollectionDto.instagramLink;
      collection.mediumLink = createCollectionDto.mediumLink;
      collection.telegramLink = createCollectionDto.telegramLink;
      collection.earningFee = createCollectionDto.earningFee;
      collection.blockchain = createCollectionDto.blockchain;
      collection.paymentToken = createCollectionDto.paymentToken;
      collection.displayTheme = createCollectionDto.displayTheme;
      collection.explicitOrSensitiveContent =
        createCollectionDto.explicitOrSensitiveContent;
      collection.owner = walletAddress;

      collection = await this.collectionRepository.save(collection);
      return collection;
    } catch (error) {
      if (error.code === ResponseStatusCode.UNIQUE_CONSTRAINTS)
        throw new ConflictException(ResponseMessage.UNIQUE_CONSTRAINTS_NAME);
      else throw new InternalServerErrorException();
    }
  }

  async findAll(filterDto: FilterDto): Promise<any> {
    try {
      const { take, skip } = filterDto;
      const filter = {
        earningWalletAddress: '',
        name: '',
        isVerified: null,
        status: '',
      };
      if (filterDto.earningWalletAddress) {
        filterDto.earningWalletAddress = filter.earningWalletAddress;
      } else {
        delete filter.earningWalletAddress;
      }
      if (filterDto.name) {
        filterDto.name = filter.name;
      } else {
        delete filter.name;
      }
      if (filterDto.status) {
        filterDto.status = filter.status;
      } else {
        delete filter.status;
      }

      if (filterDto.isVerified) {
        filterDto.isVerified = filter.isVerified;
      } else {
        delete filter.isVerified;
      }

      const collections = await this.collectionRepository.findAndCount({
        take,
        skip,
        where: filter,
      });
      return collections;
    } catch (error) {
      return { msg: ResponseMessage.INTERNAL_SERVER_ERROR };
    }
  }

  async findOne(id: string, owner: string): Promise<any> {
    try {
      const collection = await this.collectionRepository.findOne({
        where: [{ id: id, isDeleted: false, owner: owner }],
      });
      if (collection) return collection;
      else {
        return { msg: ResponseMessage.COLLECTION_DOES_NOT_EXIST };
      }
    } catch (error) {
      return { msg: ResponseMessage.INTERNAL_SERVER_ERROR };
    }
  }

  async update(id: string, updateCollectionDto: UpdateCollectionsDto) {
    try {
      console.log('inside service', updateCollectionDto);
      const isUpdated = await this.collectionRepository.update(
        { id },
        updateCollectionDto,
      );
      console.log('isUpdated', isUpdated);
      return { status: 200, msg: 'Collection updated succesfully' };
    } catch (error) {
      console.log('error', error);
      return { msg: ResponseMessage.INTERNAL_SERVER_ERROR };
    }
  }

  /**
   * @description Function will add current user to the collection watchlist
   * @param walletAddress , wallet address of the current user
   * @param collectionId , collecton id to perform the update
   * @returns Promise
   */
  async addUserInWatchlist(
    walletAddress: string,
    collectionId: string,
  ): Promise<boolean> {
    try {
      const collection = await this.collectionRepository.findOne({
        where: { id: collectionId },
        relations: ['watchlist'],
      });
      if (!collection) return null;

      const user = await this.userRepository.findOne({
        where: {
          walletAddress: walletAddress,
        },
      });
      if (!user) return null;

      if (collection.watchlist) {
        collection.watchlist.push(user);
      } else {
        collection.watchlist = [user];
      }

      await this.collectionRepository.save(collection);

      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async removeUseFromWatchlist(
    walletAddress: string,
    collectionId: string,
  ): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          walletAddress: walletAddress,
        },
      });
      if (!user) return null;

      await this.collectionRepository
        .createQueryBuilder()
        .relation(Collection, 'watchlist')
        .of(collectionId)
        .remove(user.id);

      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async getCollectionForUser(walletAddress: string): Promise<Collection[]> {
    try {
      const collections = await this.collectionRepository
        .createQueryBuilder('collection')
        .innerJoinAndSelect(
          'collection.watchlist',
          'watchlist',
          'watchlist.walletAddress = :walletAddress',
          { walletAddress },
        )
        .select([
          'collection.id',
          'collection.logo',
          'collection.featureImage',
          'collection.name',
          'collection.banner',
        ])
        .getMany();

      return collections;
    } catch (error) {
      console.log(error);
    }
  }
}
