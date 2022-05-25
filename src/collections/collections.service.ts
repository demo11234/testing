import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { CreateCollectionsDto } from './dto/create-collections.dto';
import { UpdateCollectionsDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { FilterDto } from './dto/filter.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { ResponseMessage } from 'shared/ResponseMessage';
import { User } from '../../src/user/entities/user.entity';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { UniqueCollectionCheck } from './dto/unique-collection-check.dto';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { NotFoundException } from '@nestjs/common';
import validator from 'validator';
import { Chains } from 'src/chains/entities/chains.entity';
import { Category } from 'src/admin/entities/categories.entity';
import { UserRepository } from 'src/user/repositories/user.repository';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(NftItem)
    private readonly nftItemRepository: Repository<NftItem>,
    @InjectRepository(Chains)
    private chainsRepository: Repository<Chains>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * Function to create a collection
   * @param owner Owner for the collection
   * @param createCollectionDto collection DTo for creating a collection
   * @returns Promise
   */
  async create(owner: User, createCollectionDto: CreateCollectionsDto) {
    try {
      let collection = new Collection();
      collection.logo = createCollectionDto.logo;
      collection.featureImage = createCollectionDto.featureImage;
      collection.banner = createCollectionDto.banner;
      collection.name = createCollectionDto.name;
      if (createCollectionDto.slug) {
        collection.slug = createCollectionDto.slug;
      } else {
        collection.slug = createCollectionDto.name.replace(/\s+/g, '-');
      }
      collection.description = createCollectionDto.description;
      collection.websiteLink = createCollectionDto.websiteLink;
      collection.categoryId = createCollectionDto.categoryId;
      collection.discordLink = createCollectionDto.discordLink;
      collection.instagramLink = createCollectionDto.instagramLink;
      collection.mediumLink = createCollectionDto.mediumLink;
      collection.telegramLink = createCollectionDto.telegramLink;
      collection.earningFee = createCollectionDto.earningFee;
      collection.earningWalletAddress =
        createCollectionDto.earningWalletAddress;
      const chains = await this.chainsRepository.findOne({
        where: { id: createCollectionDto.blockchain },
      });
      collection.blockchain = chains;
      collection.paymentToken = createCollectionDto.paymentToken;
      collection.displayTheme = createCollectionDto.displayTheme;
      collection.explicitOrSensitiveContent =
        createCollectionDto.explicitOrSensitiveContent;
      collection.owner = owner;
      collection.ownerWalletAddress = owner.walletAddress;

      collection = await this.collectionRepository.save(collection);
      return collection;
    } catch (error) {
      console.log(error);
      if (error.code === ResponseStatusCode.UNIQUE_CONSTRAINTS)
        throw new ConflictException(ResponseMessage.UNIQUE_CONSTRAINTS_NAME);
      else throw new InternalServerErrorException();
    }
  }

  /**
   * Function to fetch collection by owner or collaborator
   * @param id id of the the user/collaborator
   * @returns Promise
   */
  async findByOwnerOrCollaborator(id: string): Promise<any> {
    try {
      const isDeletedFalse = false;
      const collectionsByOwner = await this.collectionRepository
        .createQueryBuilder('collection')
        .where('collection.isDeleted = :isDeletedFalse', { isDeletedFalse })
        .innerJoinAndSelect('collection.owner', 'owner', 'owner.id = :id', {
          id,
        })
        .select(['collection', 'owner.userName'])
        .getRawMany();

      const collectionsByCollaborators = await this.collectionRepository
        .createQueryBuilder('collection')
        .where('collection.isDeleted = :isDeletedFalse', { isDeletedFalse })
        .innerJoinAndSelect(
          'collection.collaborators',
          'collaborators',
          'collaborators.id = :id',
          {
            id,
          },
        )
        .select(['collection', 'collaborators.userName'])
        .getRawMany();
      const toBeSent = collectionsByOwner.concat(collectionsByCollaborators);
      return toBeSent;
    } catch (error) {
      return { msg: ResponseMessage.INTERNAL_SERVER_ERROR };
    }
  }

  /**
   * Function to fetch collections based on filters
   * @param filterDto filters to fetch collectoions
   * @returns Promise
   */
  async findAll(filterDto: FilterDto): Promise<any> {
    try {
      const { search, isVerified, earningWalletAddress, slug } = filterDto;
      let { take, skip } = filterDto;
      take = take ? take : 0;
      skip = skip ? skip : 1;

      let collections = await this.collectionRepository
        .createQueryBuilder('collection')
        .leftJoinAndSelect('collection.nftItem', 'nftItem')
        .leftJoinAndSelect('collection.watchlist', 'watchlist');

      if (search) {
        collections = await collections.andWhere(
          'collection.name ilike :value',
          {
            value: `%${search}%`,
          },
        );
      }
      if (slug) {
        collections = await collections.andWhere(
          'collection.slug ilike :value',
          {
            value: `%${slug}%`,
          },
        );
      }
      if (isVerified) {
        collections = await collections.andWhere(
          'collection.isVerified = :value',
          {
            value: isVerified,
          },
        );
      }
      if (earningWalletAddress) {
        collections = await collections.andWhere(
          'collection.earningWalletAddress = :value',
          {
            value: earningWalletAddress,
          },
        );
      }

      const data = collections
        .skip((skip - 1) * take)
        .take(take)
        .getMany();

      return data;
    } catch (error) {
      return { msg: ResponseMessage.INTERNAL_SERVER_ERROR };
    }
  }

  /**
   * Function to find a single collection using id
   * @param id , id of the collection
   * @returns Promise
   */
  async findOne(id: string): Promise<any> {
    try {
      let collection;
      if (validator.isUUID(id)) {
        collection = await this.collectionRepository.findOne({
          where: { id: id },
          relations: ['nftItem'],
        });
      } else {
        collection = await this.collectionRepository.findOne({
          where: { slug: id },
          relations: ['nftItem'],
        });
      }
      collection.nftItemCount = collection.__nftItem__.length;
      collection.ownerCount = collection.__nftItem__.length;
      // console.log(collection.nftItemCount);
      return collection;
    } catch (error) {
      return { msg: ResponseMessage.INTERNAL_SERVER_ERROR };
    }
  }

  /**
   * Function to find collections using category slug
   * @param id , id of the category
   * @returns Promise
   */
  async findByCategory(categorySlug: string): Promise<any> {
    let categoryDetails: any;

    // category lookup
    try {
      categoryDetails = await this.categoryRepository.findOne({
        categorySlug: categorySlug,
      });

      if (!categoryDetails) {
        return { msg: ResponseMessage.CATEGORY_NOT_FOUND };
      }
    } catch (err) {
      console.log('Error while validating category');
      return { msg: ResponseMessage.INTERNAL_SERVER_ERROR };
    }

    // fetch all collection based on selected category
    try {
      const collections = await this.collectionRepository.find({
        where: { categoryId: categoryDetails.id },
      });
      return collections;
    } catch (error) {
      return { msg: ResponseMessage.INTERNAL_SERVER_ERROR };
    }
  }

  /**
   * Function to update a collection
   * @param id , id of collection
   * @param updateCollectionDto , update object
   * @returns Promise
   */
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
      if (error.code === ResponseStatusCode.UNIQUE_CONSTRAINTS)
        throw new ConflictException(ResponseMessage.UNIQUE_CONSTRAINTS_NAME);
      throw new Error(error);
    }
  }

  /**
   * @description Function will add current user to the collection collaborators
   * @param walletAddress , wallet address of the current user
   * @param collectionId , collecton id to perform the update
   * @returns Promise
   */
  async addUserInCollaborators(
    ownerWalletAddress: string,
    updateCollaboratorDto: UpdateCollaboratorDto,
  ): Promise<any> {
    try {
      const collection = await this.collectionRepository.findOne({
        where: { id: updateCollaboratorDto.collectionId },
        relations: ['collaborators'],
      });
      if (!collection) return null;
      if (collection.owner.walletAddress !== ownerWalletAddress) {
        return { status: 401, msg: ResponseMessage.UNAUTHORIZED };
      }
      if (
        collection.owner.walletAddress === updateCollaboratorDto.walletAddress
      ) {
        return {
          status: ResponseStatusCode.CONFLICT,
          msg: ResponseMessage.OWNER_CANNOT_BE_ADDED_AS_COLLABORATOR,
        };
      }
      let flag = 0;
      for (let i = 0; i < collection.collaborators.length; i++) {
        if (
          collection.collaborators[i].walletAddress ===
          updateCollaboratorDto.walletAddress
        ) {
          flag = 1;
        }
      }
      if (flag === 1) {
        return {
          status: ResponseStatusCode.CONFLICT,
          msg: ResponseMessage.USER_ALREADY_IN_COLLABORATORS,
        };
      }

      let user: User;
      user = await this.userRepository.findOne({
        where: {
          walletAddress: updateCollaboratorDto.walletAddress,
        },
      });
      if (!user) {
        const temp = this.userRepository.create({
          walletAddress: updateCollaboratorDto.walletAddress,
        });
        user = await this.userRepository.save(temp);
      }

      if (collection.collaborators) {
        collection.collaborators.push(user);
      } else {
        collection.collaborators = [user];
      }

      await this.collectionRepository.save(collection);

      return true;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Function to remove a user from collaborator
   * @param walletAddress , wallet address for the current user
   * @param collectionId collection id to add collaborator
   * @returns Promise
   */
  async removeUserFromCollaborators(
    ownerWalletAddress: string,
    updateCollaboratorDto: UpdateCollaboratorDto,
  ): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          walletAddress: updateCollaboratorDto.walletAddress,
        },
      });
      const collection = await this.collectionRepository.findOne({
        where: { id: updateCollaboratorDto.collectionId },
        relations: ['collaborators'],
      });
      if (!collection) return null;
      if (collection.owner.walletAddress !== ownerWalletAddress) {
        return { status: 401, msg: ResponseMessage.UNAUTHORIZED };
      }
      if (
        collection.owner.walletAddress === updateCollaboratorDto.walletAddress
      ) {
        return {
          status: ResponseStatusCode.CONFLICT,
          msg: ResponseMessage.OWNER_CANNOT_BE_ADDED_AS_COLLABORATOR,
        };
      }
      if (!user) return null;
      let flag = 0;
      for (let i = 0; i < collection.collaborators.length; i++) {
        if (
          collection.collaborators[i].walletAddress ===
          updateCollaboratorDto.walletAddress
        ) {
          flag = 1;
        }
      }
      if (flag === 0) {
        return { status: 409, msg: 'Already deleted' };
      }

      await this.collectionRepository
        .createQueryBuilder()
        .relation(Collection, 'collaborators')
        .of(updateCollaboratorDto.collectionId)
        .remove(user.id);

      return true;
    } catch (error) {
      console.log(error);
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

  /**
   * Functio to remove collection from watchlist
   * @param walletAddress , wallet address of an user
   * @param collectionId Collection id
   * @returns Promise
   */
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

  /**
   * Function to get collection for user that are under watchlist
   * @param walletAddress current user wallet address
   * @returns Promise
   */
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
        .select(['collection'])
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

      if (uniqueCollectionCheck.slug) {
        const collectionByUrl = await this.collectionRepository.findOne({
          slug: uniqueCollectionCheck.slug,
        });
        result = !!collectionByUrl;
      }

      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   * @description this will delete collection if logged in user own all item in this collection
   * @param id
   * @returns collection deleted
   * @author vipin
   */
  async deleteCollection(id: string, request): Promise<any> {
    try {
      //-- fetching collection using given id
      const collection = await this.collectionRepository.findOne({ id });

      if (!collection)
        throw new NotFoundException(ResponseMessage.COLLECTION_DOES_NOT_EXIST);
      if (request.user.walletAddress !== collection.ownerWalletAddress)
        throw new ConflictException(
          ResponseMessage.USER_DOES_NOT_OWN_COLLECTION,
        );

      //-- fetching all item from this collection
      const item = await this.nftItemRepository.find({
        where: { collection: { id } },
        relations: ['collection'],
      });

      let flag = 0;
      item.forEach((item) => {
        if (item.owner !== request.user.walletAddress) flag = 1;
      });

      if (flag === 1)
        throw new BadRequestException(ResponseMessage.USER_DOSENT_OWN_ALL_ITEM);
      collection.isDeleted = true;

      await this.collectionRepository.update(id, collection);
      await this.collectionRepository.softDelete({ id });
      await this.nftItemRepository.softRemove(item);

      return ResponseMessage.COLLECTION_DELETED;
    } catch (error) {
      return error;
    }
  }

  /**
   * Function to find collections using categoryId
   * @param id , id of the category
   * @returns Promise
   */
  async findStatsByCollectionId(collectionId: string): Promise<any> {
    try {
      const collection = await this.collectionRepository.findOne({
        where: { id: collectionId },
      });
      return collection.stats;
    } catch (error) {
      return { msg: ResponseMessage.INTERNAL_SERVER_ERROR };
    }
  }
}
