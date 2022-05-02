import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityFilterDto } from './dto/activity-filter.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async createActivity(createActivityDto: CreateActivityDto) {
    try {
      let activity = new Activity();
      activity.eventType = createActivityDto.eventType;
      activity.asset = createActivityDto.asset;
      activity.fromAccount = createActivityDto.fromAccount;
      activity.toAccount = createActivityDto.toAccount;
      activity.isPrivate = createActivityDto.isPrivate;
      activity.paymentToken = createActivityDto.paymentToken;
      activity.quantity = createActivityDto.quantity;
      activity.totalPrice = createActivityDto.totalPrice;
      activity.collection = createActivityDto.collection;

      activity = await this.activityRepository.save(activity);
      return activity;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: string) {
    try {
      const activity = await this.activityRepository.findOne(id);
      if (!activity) return null;
      return activity;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(filterDto: ActivityFilterDto): Promise<[Activity[], number]> {
    try {
      const {
        take,
        skip,
        eventType,
        asset,
        fromAccount,
        toAccount,
        paymentToken,
        search,
        collection,
      } = filterDto;
      const activities = await this.activityRepository.findAndCount({
        take,
        skip,
      });
      if (!activities[0]) return null;
      activities[0] = activities[0].filter((activity) => {
        activity.collection = collection;
      });
      if (eventType) {
        activities[0] = activities[0].filter((activity) => {
          activity.eventType === eventType;
        });
      }
      if (asset) {
        activities[0] = activities[0].filter((activity) => {
          activity.asset === asset;
        });
      }
      if (fromAccount) {
        activities[0] = activities[0].filter((activity) => {
          activity.fromAccount === fromAccount;
        });
      }
      if (toAccount) {
        activities[0] = activities[0].filter((activity) => {
          activity.toAccount === toAccount;
        });
      }
      if (paymentToken) {
        activities[0] = activities[0].filter((activity) => {
          activity.paymentToken === paymentToken;
        });
      }
      if (search) {
        activities[0] = activities[0].filter(
          (activity) =>
            activity.eventType.includes(search) ||
            activity.fromAccount.includes(search) ||
            activity.toAccount.includes(search) ||
            activity.asset.includes(search) ||
            activity.paymentToken.includes(search),
        );
      }
      return activities;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, updateActivityDto: UpdateActivityDto) {
    try {
      const isUpdated = await this.activityRepository.update(
        { id },
        updateActivityDto,
      );
      if (!isUpdated) return null;
      return isUpdated;
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(id: string) {
    try {
      const deleted = await this.activityRepository.delete(id);
      if (!deleted) return null;
      return deleted;
    } catch (error) {}
  }
}
