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

      const eventTypeArray = [eventType];
      const collectionIdArray = [collectionId];
      const chainArray = [chain];

      let activity = [];

      if (collectionId && chain && eventType) {
        activity = await this.activityRepository
          .createQueryBuilder('activity')
          .where('activity.collectionId IN (:...collectionIdArray)', {
            collectionIdArray,
          })
          .andWhere('activity.eventType IN (:...eventTypeArray)', {
            eventTypeArray,
          })
          .leftJoinAndSelect('activity.nftItem, nftItem', 'nftItem')
          .leftJoinAndSelect(
            'nft_item.blockChain',
            'chains',
            'chains.id IN (:...chainArray)',
            { chainArray },
          )
          .skip(skip)
          .take(take)
          .getMany();
      } else if (collectionId && chain) {
        activity = await this.activityRepository
          .createQueryBuilder('activity')
          .where('activity.collectionId IN (:...collectionIdArray)', {
            collectionIdArray,
          })
          .leftJoinAndSelect('activity.nftItem', 'nft_item')
          .leftJoinAndSelect(
            'nft_item.blockChain',
            'chains',
            'chains.id IN (:...chainArray)',
            { chainArray },
          )
          .skip(skip)
          .take(take)
          .getMany();
      } else if (chain && eventType) {
        activity = await this.activityRepository
          .createQueryBuilder('activity')
          .where('activity.eventType IN (:...eventTypeArray)', {
            eventTypeArray,
          })
          .leftJoinAndSelect('activity.nftItem', 'nft_item')
          .leftJoinAndSelect(
            'nft_item.blockChain',
            'chains',
            'chains.id IN (:...chainArray)',
            { chainArray },
          )
          .skip(skip)
          .take(take)
          .getMany();
      } else if (eventType && collectionId) {
        activity = await this.activityRepository
          .createQueryBuilder('activity')
          .where('activity.collectionId IN (:...collectionIdArray)', {
            collectionIdArray,
          })
          .andWhere('activity.eventType IN (:...eventTypeArray)', {
            eventTypeArray,
          })
          .skip(skip)
          .take(take)
          .getMany();
      } else if (collectionId) {
        activity = await this.activityRepository
          .createQueryBuilder('activity')
          .where('activity.collectionId IN (:...collectionIdArray)', {
            collectionIdArray,
          })
          .skip(skip)
          .take(take)
          .getMany();
      } else if (chain) {
        activity = await this.activityRepository
          .createQueryBuilder('activity')
          .leftJoinAndSelect('activity.nftItem', 'nft_item')
          .leftJoinAndSelect(
            'nft_item.blockChain',
            'chains',
            'chains.id IN (:...chainArray)',
            { chainArray },
          )
          .skip(skip)
          .take(take)
          .getMany();
      } else if (eventType) {
        activity = await this.activityRepository
          .createQueryBuilder('activity')
          .where('activity.eventType IN (:...eventTypeArray)', {
            eventTypeArray,
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
