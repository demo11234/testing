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
  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log('calling algolia user upload function every 4 hours');
    this.algoliaUserUpload();

    console.log('calling algolia Collection upload function every 4 hours');
    this.algoliaCollectionUpload();
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
      .subtract({ minutes: '10' })
      .format('YYYY-MM-DD HH:MM:SS.SSSSSS');

    const result = await this.userRepository.find({
      select: [
        'id',
        'userName',
        'walletAddress',
        'imageUrl',
        'isBlocked',
        'createdAt',
        'objectID',
      ],
      where: [
        {
          updatedAt: MoreThan(timeStamp),
        },
        // {
        //   updatedAt: MoreThan(timeStamp),
        // },
      ],
    });

    const success = await userIndex
      .saveObjects(result, {
        autoGenerateObjectIDIfNotExist: true,
      })
      .then(async ({ objectIDs }) => {
        //[TODO] we need to update the id for each user record.
        // [TODO] filter the records that don;t have objectID and update the objectId using the index
        const filterObjects = [];

        result.forEach((val: any, idx: any) => {
          if (!val.objectID) {
            filterObjects.push(
              this.userRepository.update(
                { id: val.id },
                { objectID: objectIDs[idx] },
              ),
            );
          }
        });
        if (filterObjects.length) await Promise.all(filterObjects);
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
      .subtract({ minutes: '10' })
      .format('YYYY-MM-DD HH:MM:SS.SSSSSS');

    //collection adding
    const result = await this.collectionRepository.find({
      select: [
        'id',
        'name',
        'banner',
        'logo',
        'blockchain',
        'slug',
        'isVerified',
        'isMintable',
        'isSafelisted',
        'objectID',
      ],
      where: [
        // {
        //   createdAt: MoreThan(timeStamp),
        // },
        {
          updatedAt: MoreThan(timeStamp),
        },
      ],
      relations: ['blockchain'],
    });

    // adding total count for items
    const arr = result.map((val) => {
      const obj: any = Object.assign({}, val);
      obj.totalCount = 0;
      return obj;
    });

    const success = await collectionIndex
      .saveObjects(arr, {
        autoGenerateObjectIDIfNotExist: true,
      })
      .then(async ({ objectIDs }) => {
        const filterObjects = [];
        arr.forEach((val: any, idx: any) => {
          if (!val.objectID) {
            filterObjects.push(
              this.collectionRepository.update(
                { id: val.id },
                { objectID: objectIDs[idx] },
              ),
            );
          }
        });
        if (filterObjects.length) await Promise.all(filterObjects);
        return objectIDs;
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
    return success;
  }
}
