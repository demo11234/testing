import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  /**
   * @description createActivity will create new activity
   * @param CreateActivityInterface
   * @returns Details of created activity
   * @author Jeetanshu Srivastava
   */
  async createActivity(
    createActivityInterface: CreateActivityInterface,
  ): Promise<Activity> {
    try {
      const activity = new Activity();
      const activityInfo = Object.assign({}, createActivityInterface);

      if (activityInfo.toAccount) {
        activity.toAccount = await this.userRepository.findOne({
          walletAddress: activityInfo.toAccount,
        });
        delete activityInfo.toAccount;
      }
      if (activityInfo.fromAccount) {
        activity.fromAccount = await this.userRepository.findOne({
          walletAddress: activityInfo.fromAccount,
        });
        delete activityInfo.fromAccount;
      }
      if (activityInfo.winnerAccount) {
        activity.winnerAccount = await this.userRepository.findOne({
          walletAddress: activityInfo.winnerAccount,
        });
        delete activityInfo.winnerAccount;
      }

      if (activityInfo.nftItem) {
        activity.nftItem = await this.nftItemRepository.findOne({
          id: activityInfo.nftItem,
        });
        delete activityInfo.nftItem;
      }

      const keys = Object.keys(activityInfo);
      keys.forEach((key) => {
        activity[key] = activityInfo[key];
      });

      return await this.activityRepository.save(activity);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description getActivity will return activities based on given filters
   * @param ActivityFilterInterface
   * @returns Details of activity
   * @author Jeetanshu Srivastava
   */
  async getActivity(
    activityFilterInterface: ActivityFilterInterface,
  ): Promise<Activity[]> {
    try {
      const { collectionId, chain, eventType } = activityFilterInterface;

      let { take, skip } = activityFilterInterface;

      take = take ? take : 0;
      skip = skip ? skip : 1;

      let activity = await this.activityRepository
        .createQueryBuilder('activity')
        .where('activity.isDeleted = :isDeleted', { isDeleted: false })
        .leftJoinAndSelect('activity.fromAccount', 'fromAccount')
        .leftJoinAndSelect('activity.toAccount', 'toAccount')
        .leftJoinAndSelect('activity.nftItem', 'nft_item')
        .leftJoinAndSelect('nft_item.blockChain', 'chains');

      if (collectionId) {
        const collectionIdArray = collectionId.split(',').map((s) => s.trim());
        activity = await activity.andWhere(
          'activity.collectionId IN (:...collectionIdArray)',
          { collectionIdArray },
        );
      }

      if (chain) {
        const chainArray = chain.split(',').map((s) => s.trim());
        activity = await activity.andWhere('chains.id IN (:...chainArray)', {
          chainArray,
        });
      }

      if (eventType) {
        const eventTypeArray = eventType.split(',').map((s) => s.trim());
        activity = await activity.andWhere(
          'activity.eventType IN (:...eventTypeArray)',
          { eventTypeArray },
        );
      }

      return activity
        .skip((skip - 1) * take)
        .take(take)
        .orderBy('activity.createdDate', 'DESC')
        .getMany();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description getActivityByItemId will return activity details with given item id
   * @param id
   * @returns Details of item activity
   * @author Jeetanshu Srivastava
   */
  async getActivityByItemId(id: string): Promise<Activity[]> {
    try {
      const activity = await this.activityRepository
        .createQueryBuilder('activity')
        .leftJoinAndSelect('activity.fromAccount', 'fromAccount')
        .leftJoinAndSelect('activity.toAccount', 'toAccount')
        .leftJoinAndSelect('activity.winnerAccount', 'winnerAccount')
        .leftJoinAndSelect('activity.nftItem', 'nftItem')
        .where('nftItem.id = :id', { id })
        .orderBy('activity.createdDate', 'DESC')
        .getMany();
      return activity;
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * @description Find all activities for perticular user
   * @param id
   * @returns Array of all activities
   * @author Mohan
   */
  async findActivitiesForUser(id: string): Promise<any> {
    try {
      const activities = await this.activityRepository.find({
        where: [{ toAccount: { id } }, { fromAccount: { id } }],
        relations: ['toAccount', 'fromAccount', 'nftItem'],
        order: { createdDate: 'DESC' },
      });

      return activities;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
