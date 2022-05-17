import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import algoliasearch from 'algoliasearch';
import { Collection } from 'src/collections/entities/collection.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');

@Injectable()
export class ServicesService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
  ) {}
  /**
   * @description cron job for uplading data to algolia
   * @author Mohan Chaudhari
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    console.log('calling algolia user upload function every 4 hours');
    const algoliaReturnedUser = await this.algoliaUserUpload();
    console.log(algoliaReturnedUser);

    console.log('calling algolia Collection upload function every 4 hours');
    const algoliaReturnedCollection = await this.algoliaCollectionUpload();
    console.log(algoliaReturnedCollection);
  }

  /**
   * @description uploading User entries to Algolia
   * @returns Object Ids pushed to Algolia
   * @author Mohan
   */
  async algoliaUserUpload() {
    const client = algoliasearch(
      await this.configService.get('ALGOLIA_APPID'),
      await this.configService.get('ALGOLIA_APIKEY'),
    );

    const userIndex = client.initIndex('user_content');

    //User adding

    const timeStamp = moment()
      .subtract(1, 'h')
      .format('YYYY-MM-DD HH:MM:SS.SSSSSS');

    const result = await this.userRepository.find({
      select: [
        'id',
        'userName',
        'walletAddress',
        'imageUrl',
        'isBlocked',
        'createdAt',
      ],
      where: [
        {
          createdAt: MoreThan(timeStamp),
        },
        {
          updatedAt: MoreThan(timeStamp),
        },
      ],
    });

    const success = await userIndex
      .saveObjects(result, {
        autoGenerateObjectIDIfNotExist: true,
      })
      .then(({ objectIDs }) => {
        return objectIDs;
      })
      .catch((err) => {
        throw new Error(err);
      });
    return success;
  }
  /**
   * @description uploading collection entries to Algolia
   * @returns Object Ids pushed to Algolia
   * @author Mohan
   */
  async algoliaCollectionUpload() {
    const client = algoliasearch(
      await this.configService.get('ALGOLIA_APPID'),
      await this.configService.get('ALGOLIA_APIKEY'),
    );

    const collectionIndex = client.initIndex('collection_content');

    const timeStamp = moment()
      .subtract(1, 'h')
      .format('YYYY-MM-DD HH:MM:SS.SSSSSS');

    //collection adding
    const result = await this.collectionRepository.find({
      select: [
        'id',
        'name',
        'banner',
        'blockchain',
        'slug',
        'isVerified',
        'isMintable',
        'isSafelisted',
        'slug',
        'status',
      ],
      where: [
        {
          createdAt: MoreThan(timeStamp),
        },
        {
          updatedAt: MoreThan(timeStamp),
        },
      ],
    });

    const success = await collectionIndex
      .saveObjects(result, {
        autoGenerateObjectIDIfNotExist: true,
      })
      .then(({ objectIDs }) => {
        console.log(objectIDs);
        return objectIDs;
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
    return success;
  }
}
