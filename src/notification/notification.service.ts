import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationDto } from './dto/notification.dto';
import { Notification } from './entity/notification.entity'

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>
    ){}

    /**
   * @description update will update motification 
   * @param user
   * @param walletAddress
   * @returns it will return updated notifiction
   * @author Vipin
   */
    async createNotification (walletAddress, user): Promise<any>{
        try {
            const data = this.notificationRepository.save(walletAddress, user);
            return data;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
   * @description update will update motification 
   * @param notificationDto
   * @param walletAddress
   * @returns it will return updated notifiction
   * @author Vipin
   */
    async updateNotification(walletAddress: string, notificationDto: NotificationDto) {
        try {
          const updated = await this.notificationRepository.update(
            walletAddress,
            notificationDto,
          );
          if (updated)
            return { status: 200, msg: 'notification updated succesfully' };
        } catch (error) {
          throw new Error(error);
        }
    }

    /**
   * @description it will show notifiction of user
   * @param walletAddress
   * @returns it will return notification of user
   * @author Vipin
   */
    async getNotification(walletAddress: string) {
        try {
          const data = await this.notificationRepository.findOne({walletAddress});
          if (data) return data;
        } catch (error) {
          throw new Error(error);
        }
    }
}
