import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionsDto } from './dto/create-collections.dto';
import { UpdateCollectionsDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
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
      return { status: HttpStatus.CREATED, collection };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      const collections = await this.collectionRepository.find();
      if (collections) return collections;
    } catch (error) {
      throw new BadRequestException('No collections in database');
    }
  }

  async findOne(id: string) {
    try {
      const collection = await this.collectionRepository.findOne({ id });
      if (collection) return collection;
    } catch (error) {
      throw new BadRequestException('No such collection found');
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
      throw new BadRequestException('Bad Request for updating Collection');
    }
  }
}
