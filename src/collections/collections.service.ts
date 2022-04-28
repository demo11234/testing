import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionsDto } from './dto/create-collections.dto';
import { UpdateCollectionsDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { ResponseModel } from 'src/responseModel';
import { FilterDto } from './dto/filter.dto';
import { ResponseMessage } from 'shared/ResponseMessage';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    private readonly responseModel: ResponseModel,
  ) {}

  async create(createCollectionDto: CreateCollectionsDto) {
    try {
      let collection = new Collection();
      collection.logo = createCollectionDto.logo;
      collection.featureImage = createCollectionDto.featureImage;
      collection.banner = createCollectionDto.banner;
      collection.name = createCollectionDto.name;
      collection.url = createCollectionDto.url;
      collection.description = createCollectionDto.description;
      collection.websiteLink = createCollectionDto.websiteLink;
      collection.categoryID = createCollectionDto.categoryId;
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

      collection = await this.collectionRepository.save(collection);
      return collection;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(
    filterDto: FilterDto,
    owner: string,
  ): Promise<[Collection[], number]> {
    try {
      const { take, skip, name, status, isVerified, search } = filterDto;
      const collections = await this.collectionRepository.findAndCount({
        take,
        skip,
      });
      if (collections[0]) {
        collections[0] = collections[0].filter((collection) => {
          collection.isDeleted === false;
        });
        collections[0] = collections[0].filter((collection) => {
          collection.owner.id === owner;
        });
        if (name) {
          collections[0] = collections[0].filter((collection) => {
            collection.name === name;
          });
        }
        if (status) {
          collections[0] = collections[0].filter((collection) => {
            collection.status.toString() === status;
          });
        }

        if (isVerified) {
          collections[0] = collections[0].filter((collection) => {
            collection.isVerified === isVerified;
          });
        }
        if (search) {
          collections[0] = collections[0].filter(
            (collection) =>
              collection.name.includes(search) ||
              collection.description.includes(search) ||
              collection.displayTheme.includes(search),
          );
        }
        return collections;
      } else throw new Error(ResponseMessage.COLLECTIONS_DO_NOT_EXIST);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: string, owner: string) {
    try {
      const collection = await this.collectionRepository.findOne({
        where: [{ id: id, isDeleted: false, owner: owner }],
      });
      if (collection) return collection;
      else {
        throw new Error(ResponseMessage.COLLECTION_DOES_NOT_EXIST);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, updateCollectionDto: UpdateCollectionsDto) {
    try {
      const isUpdated = await this.collectionRepository.update(
        { id },
        updateCollectionDto,
      );
      if (isUpdated)
        return { status: 200, msg: 'Collection updated succesfully' };
    } catch (error) {
      throw new Error(error);
    }
  }
}
