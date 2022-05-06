import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { ActivityFilterInterface } from './interface/activity-filter.interface';
import { CreateActivityInterface } from './interface/create-activity.interface';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(NftItem)
    private readonly nftItemRepository: Repository<NftItem>,
  ) {}

  async createActivity(
    createActivityInterface: CreateActivityInterface,
  ): Promise<Activity> {
    try {
      const activity = new Activity();

      if (createActivityInterface.toAccount) {
        activity.toAccount = await this.userRepository.findOne({
          walletAddress: createActivityInterface.toAccount,
        });
        delete createActivityInterface.toAccount;
      }
      if (createActivityInterface.fromAccount) {
        activity.fromAccount = await this.userRepository.findOne({
          walletAddress: createActivityInterface.fromAccount,
        });
        delete createActivityInterface.fromAccount;
      }
      if (createActivityInterface.winnerAccount) {
        activity.winnerAccount = await this.userRepository.findOne({
          walletAddress: createActivityInterface.winnerAccount,
        });
        delete createActivityInterface.winnerAccount;
      }

      if (createActivityInterface.nftItem) {
        activity.nftItem = await this.nftItemRepository.findOne({
          id: createActivityInterface.nftItem,
        });
        delete createActivityInterface.nftItem;
      }

      const keys = Object.keys(createActivityInterface);
      keys.forEach((key) => {
        activity[key] = createActivityInterface[key];
      });

      return await this.activityRepository.save(activity);
    } catch (error) {
      console.log(error);
    }
  }

  async getActivity(
    activityFilterInterface: ActivityFilterInterface,
  ): Promise<Activity[]> {
    try {
      const { take, skip, collectionId, chain, eventType } =
        activityFilterInterface;

      let activity = [];

      if (collectionId.length && chain.length && eventType.length) {
        activity = await this.activityRepository
          .createQueryBuilder('activity')
          .where('activity.collectionId IN (:...collectionId)', {
            collectionId,
          })
          .andWhere('activity.eventType IN (:...eventType)', {
            eventType,
          })
          .leftJoinAndSelect('activity.nftItem', 'nft_item')
          .leftJoinAndSelect(
            'nft_item.blockChain',
            'chains',
            'chains.id IN (:...chain)',
            { chain },
          )
          .skip(skip)
          .take(take)
          .getMany();
      } else if (collectionId.length && chain.length) {
        activity = await this.activityRepository
          .createQueryBuilder('activity')
          .where('activity.collectionId IN (:...collectionId)', {
            collectionId,
          })
          .leftJoinAndSelect('activity.nftItem', 'nft_item')
          .leftJoinAndSelect(
            'nft_item.blockChain',
            'chains',
            'chains.id IN (:...chain)',
            { chain },
          )
          .skip(skip)
          .take(take)
          .getMany();
      } else if (chain.length && eventType.length) {
        activity = await this.activityRepository
          .createQueryBuilder('activity')
          .where('activity.eventType IN (:...eventType)', {
            eventType,
          })
          .leftJoinAndSelect('activity.nftItem', 'nft_item')
          .leftJoinAndSelect(
            'nft_item.blockChain',
            'chains',
            'chains.id IN (:...chain)',
            { chain },
          )
          .skip(skip)
          .take(take)
          .getMany();
      } else if (eventType.length && collectionId.length) {
        activity = await this.activityRepository
          .createQueryBuilder('activity')
          .where('activity.collectionId IN (:...collectionId)', {
            collectionId,
          })
          .andWhere('activity.eventType IN (:...eventType)', {
            eventType,
          })
          .skip(skip)
          .take(take)
          .getMany();
      } else if (collectionId.length) {
        activity = await this.activityRepository
          .createQueryBuilder('activity')
          .where('activity.collectionId IN (:...collectionId)', {
            collectionId,
          })
          .skip(skip)
          .take(take)
          .getMany();
      } else if (chain.length) {
        activity = await this.activityRepository
          .createQueryBuilder('activity')
          .leftJoinAndSelect('activity.nftItem', 'nft_item')
          .leftJoinAndSelect(
            'nft_item.blockChain',
            'chains',
            'chains.id IN (:...chain)',
            { chain },
          )
          .skip(skip)
          .take(take)
          .getMany();
      } else if (eventType.length) {
        activity = await this.activityRepository
          .createQueryBuilder('activity')
          .where('activity.eventType IN (:...eventType)', {
            eventType,
          })
          .skip(skip)
          .take(take)
          .getMany();
      } else {
        activity = await this.activityRepository
          .createQueryBuilder('activity')
          .skip(skip)
          .take(take)
          .getMany();
      }

      return activity;
    } catch (error) {
      console.log(error);
    }
  }

  async getActivityByItemId(id: string): Promise<Activity[]> {
    try {
      const activity = await this.activityRepository
        .createQueryBuilder('activity')
        .leftJoinAndSelect('activity.nftItem', 'nftItem', 'nftItem.id = :id', {
          id,
        })
        .getMany();
      return activity;
    } catch (error) {
      console.log(error);
    }
  }
}
