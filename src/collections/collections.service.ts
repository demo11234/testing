import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionsDto } from './dto/create-collections.dto';
import { UpdateCollectionsDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { FilterDto } from './dto/filter.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { collaboratorUpdateType } from './enums/collaborator-update-type.enum';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  async create(
    createCollectionDto: CreateCollectionsDto,
    owner: string,
  ): Promise<any> {
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
      collection.owner = owner;

      collection = await this.collectionRepository.save(collection);
      return collection;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(filterDto: FilterDto): Promise<[Collection[], number]> {
    try {
      const {
        take,
        skip,
        earningWalletAddress,
        name,
        status,
        isVerified,
        search,
      } = filterDto;
      const collections = await this.collectionRepository.findAndCount({
        take,
        skip,
      });
      if (!collections[0]) return null;
      collections[0] = collections[0].filter((collection) => {
        collection.isDeleted === false;
      });
      if (earningWalletAddress) {
        collections[0] = collections[0].filter((collection) => {
          collection.earningWalletAddress === earningWalletAddress;
        });
      }
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
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: string, owner: string): Promise<Collection> {
    try {
      const collection = await this.collectionRepository.findOne({
        where: [{ id: id, isDeleted: false, owner: owner }],
      });
      if (!collection) return null;
      return collection;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(
    id: string,
    updateCollectionDto: UpdateCollectionsDto,
  ): Promise<any> {
    try {
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

  async updateCollaborator(
    updateCollaboratorDto: UpdateCollaboratorDto,
    owner: string,
  ): Promise<any> {
    try {
      const collection = await this.collectionRepository.findOne({
        where: [
          {
            id: updateCollaboratorDto.collecionId,
            isDeleted: false,
            owner: owner,
          },
        ],
      });
      if (updateCollaboratorDto.updateType === collaboratorUpdateType.ADD) {
        collection.collaborators.push(updateCollaboratorDto.updateType);
        await this.collectionRepository.update(
          updateCollaboratorDto.collecionId,
          collection,
        );
      }
      const toBeRemoved: number = collection.collaborators.indexOf(
        updateCollaboratorDto.collaboratorWalletId,
      );
      collection.collaborators.splice(toBeRemoved, 1);
      await this.collectionRepository.update(
        updateCollaboratorDto.collecionId,
        collection,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
