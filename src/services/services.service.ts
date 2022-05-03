import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import algoliasearch from 'algoliasearch';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
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
  @Cron(CronExpression.EVERY_4_HOURS)
  async handleCron() {
    console.log('calling algolia user upload function every 4 hours');
    const algoliaReturnedUser = await this.algoliaUserUpload();
    console.log(algoliaReturnedUser);

    console.log('calling algolia Collection upload function every 4 hours');
    const algoliaReturnedCollection = await this.algoliaCollectionUpload();
    console.log(algoliaReturnedCollection);
  }
  async algoliaUserUpload() {
    const client = algoliasearch(
      await this.configService.get('ALGOLIA_APPID'),
      await this.configService.get('ALGOLIA_APIKEY'),
    );

    const userIndex = client.initIndex('user_content');

    //User adding

    const timeStamp = moment()
      .subtract(4, 'h')
      .format('YYYY-MM-DD HH:MM:SS.SSSSSS');

    console.log(timeStamp);

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

    console.log(result);

    const success = await userIndex
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

  async algoliaCollectionUpload() {
    const client = algoliasearch(
      await this.configService.get('ALGOLIA_APPID'),
      await this.configService.get('ALGOLIA_APIKEY'),
    );

    const collectionIndex = client.initIndex('collection_content');

    const timeStamp = moment()
      .subtract(4, 'h')
      .format('YYYY-MM-DD HH:MM:SS.SSSSSS');

    console.log(timeStamp);

    //collection adding
    const result = await this.collectionRepository.find({
      select: [
        'id',
        'banner',
        'blockchain',
        'url',
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
  /**
   * @description ipfs file upload
   * @returns
   */
  async IpfsuploadMetadata(): Promise<any> {
    console.log('in service');

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pinataSDK = require('@pinata/sdk');
    const pinata = pinataSDK(
      await this.configService.get('PINATA_APIKEY'),
      await this.configService.get('PINATA_APISECRET'),
    );
    pinata
      .testAuthentication()
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });

    // freeze metadata
    const body = {
      description: 'girl on the beach',
      name: 'girlonthebeach',
    };
    const options = {
      pinataMetadata: {
        name: `girl on the beach`,
        keyvalues: {
          customKey: 'customValue',
          customKey2: 'customValue2',
        },
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    const uploadResult = pinata
      .pinJSONToIPFS(body, options)
      .then((result) => {
        //handle results here
        console.log(result);
        return result;
      })
      .catch((err) => {
        //handle error here
        console.log(err);
        return err;
      });

    return uploadResult;
  }
  // async pinFileToIPFS() {}

  async freezeMetadata(metadata) {
    return;
  }
  /*
  create(createServiceDto: CreateServiceDto) {
    return 'This action adds a new service';
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }
  */
}
