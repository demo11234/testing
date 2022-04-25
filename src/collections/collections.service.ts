import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionsDto } from './dto/create-collections.dto';
import { UpdateCollectionsDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { ResponseModel } from 'src/responseModel';

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
      collection.name = createCollectionDto.name;
      collection.url = createCollectionDto.url;
      collection.websiteLink = createCollectionDto.websiteLink;
      collection.discordLink = createCollectionDto.discordLink;
      collection.instagramLink = createCollectionDto.instagramLink;
      collection.mediumLink = createCollectionDto.mediumLink;
      collection.telegramLink = createCollectionDto.telegramLink;
      collection.earningFee = createCollectionDto.earningFee;
      collection.displayTheme = createCollectionDto.displayTheme;

      collection = await this.collectionRepository.save(collection);
      return collection;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(
    take: number = 10,
    skip: number = 0,
  ): Promise<[Collection[], number]> {
    try {
      const collections = await this.collectionRepository.findAndCount({
        take,
        skip,
      });
      if (collections) {
        return collections;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: string) {
    try {
      const collection = await this.collectionRepository.findOne({ id });
      if (collection) return collection;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByUser(id: string): Promise<Collection[]> {
    try {
      return await this.collectionRepository
        .createQueryBuilder('collection')
        .where('collection.owner = :id', { id })
        .getMany();
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
