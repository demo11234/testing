import { Injectable } from '@nestjs/common';
import { Collection } from 'src/collections/entities/collection.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UtilsService {
  constructor(
    //private responseModel: ResponseModel,
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  async createDefault(owner: User, name: string, logo: string) {
    try {
      let collection = new Collection();
      collection.logo = logo;
      collection.name = name;
      collection.explicitOrSensitiveContent = false;
      collection.owner = owner;

      collection = await this.collectionRepository.save(collection);
      return collection;
    } catch (error) {
      throw new Error(error);
    }
  }
}
