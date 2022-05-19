import { Injectable } from '@nestjs/common';
import { Collection } from 'src/collections/entities/collection.entity';
import { LivePriceDto } from './dto/get-price.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import coingecko from 'coingecko-api';

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

  async getLivePrice(livePriceDto: LivePriceDto): Promise<any> {
    const coin = new coingecko();
    const { cryptoName, currencies } = livePriceDto;
    const price = await coin.simple.price({
      ids: cryptoName,
      vs_currencies: currencies,
    });
    return price;
  }
}
