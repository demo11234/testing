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
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { collaboratorUpdateType } from './enums/collaborator-update-type.enum';
import { ResponseMessage } from 'shared/ResponseMessage';
import { User } from '../../src/user/entities/user.entity';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { UniqueCollectionCheck } from './dto/unique-collection-check.dto';
// import { UserRepository } from 'src/user/repositories/user.repository';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(owner: User, createCollectionDto: CreateCollectionsDto) {
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
      collection.owner = owner;

      collection = await this.collectionRepository.save(collection);
      return collection;
    } catch (error) {
      console.log(error);
      if (error.code === ResponseStatusCode.UNIQUE_CONSTRAINTS)
        throw new ConflictException(ResponseMessage.UNIQUE_CONSTRAINTS_NAME);
      else throw new InternalServerErrorException();
    }
  }

  async findByOwnerOrCollaborator(id: string): Promise<any> {
    try {
      const isDeletedFalse = false;
      const collections = await this.collectionRepository
        .createQueryBuilder('collection')
        .where('collection.isDeleted = :isDeletedFalse', { isDeletedFalse })
        .innerJoinAndSelect('collection.owner', 'owner', 'owner.id = :id', {
          id,
        })
        .select(['collection', 'owner.userName'])
        .getRawMany();
      return collections;
    } catch (error) {
      return { msg: ResponseMessage.INTERNAL_SERVER_ERROR };
    }
  }

  async findAll(filterDto: FilterDto): Promise<any> {
    try {
      const { take, skip } = filterDto;
      const filter = Object.assign({}, filterDto);

      Object.keys(filter).forEach((value) => {
        if (!filter[value]) delete filter[value];
      });

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

  async update(
    id: string,
    updateCollectionDto: UpdateCollectionsDto,
  ): Promise<any> {
    try {
      console.log('inside service', updateCollectionDto);
      const isUpdated = await this.collectionRepository.update(
        { id },
        updateCollectionDto,
      );
      if (!isUpdated) return null;
      return isUpdated;
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(id: string): Promise<any> {
    const collection = await this.collectionRepository.findOne(id);
    collection.isDeleted = true;
    await this.collectionRepository.update(id, collection);
    return null;
  }

  // async updateCollaborator(
  //   updateCollaboratorDto: UpdateCollaboratorDto,
  //   owner: string,
  // ): Promise<any> {
  //   try {
  //     const collection = await this.collectionRepository.findOne({
  //       where: [
  //         {
  //           id: updateCollaboratorDto.collecionId,
  //           isDeleted: false,
  //           owner: owner,
  //         },
  //       ],
  //     });
  //     if (updateCollaboratorDto.updateType === collaboratorUpdateType.ADD) {
  //       collection.collaborators.push(updateCollaboratorDto.updateType);
  //       await this.collectionRepository.update(
  //         updateCollaboratorDto.collecionId,
  //         collection,
  //       );
  //     }
  //     const toBeRemoved: number = collection.collaborators.indexOf(
  //       updateCollaboratorDto.collaboratorWalletId,
  //     );
  //     collection.collaborators.splice(toBeRemoved, 1);
  //     await this.collectionRepository.update(
  //       updateCollaboratorDto.collecionId,
  //       collection,
  //     );
  //     return { status: 200, msg: 'Collection updated succesfully' };
  //   } catch (error) {
  //     console.log('error', error);
  //     return { msg: ResponseMessage.INTERNAL_SERVER_ERROR };
  //   }
  // }

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

  async getCollectionForUserWatchlist(
    walletAddress: string,
  ): Promise<Collection[]> {
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

  /**
   * @description Function will add current user to the collection favourites
   * @param walletAddress , wallet address of the current user
   * @param collectionId , collecton id to perform the update
   * @returns Promise
   */
  async addUserInFavourites(
    walletAddress: string,
    collectionId: string,
  ): Promise<boolean> {
    try {
      const collection = await this.collectionRepository.findOne({
        where: { id: collectionId },
        relations: ['favourites'],
      });
      if (!collection) return null;

      const user = await this.userRepository.findOne({
        where: {
          walletAddress,
        },
      });
      if (!user) return null;

      if (collection.favourites) {
        collection.favourites.push(user);
      } else {
        collection.favourites = [user];
      }

      await this.collectionRepository.save(collection);

      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async removeUseFromFavourites(
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
        .relation(Collection, 'favourites')
        .of(collectionId)
        .remove(user.id);

      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async getCollectionForUserFavourites(
    walletAddress: string,
  ): Promise<Collection[]> {
    try {
      const collections = await this.collectionRepository
        .createQueryBuilder('collection')
        .innerJoinAndSelect(
          'collection.favourites',
          'favourites',
          'favourites.walletAddress = :walletAddress',
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

  /**
   * @description checkUniqueCollection checks collection with unique name and url
   * @param UniqueCollectionCheck
   * @returns Boolean Values for collectionNameExists and collectionUrlExists
   * @author Jeetanshu Srivastava
   */
  async checkUniqueCollection(
    uniqueCollectionCheck: UniqueCollectionCheck,
  ): Promise<any> {
    let result = false;
    try {
      if (uniqueCollectionCheck.name) {
        const collectionByName = await this.collectionRepository.findOne({
          name: uniqueCollectionCheck.name,
        });
        result = !!collectionByName;
      }

      if (uniqueCollectionCheck.url) {
        const collectionByUrl = await this.collectionRepository.findOne({
          url: uniqueCollectionCheck.url,
        });
        result = !!collectionByUrl;
      }

      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
