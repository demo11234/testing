import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
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
   * @description update will create motification settings when user is created
   * @param user
   * @param walletAddress
   * @returns it will return default notifiction of new user
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
   * @description update will update notification settings of login user
   * @param User
   * @param notificationDto
   * @returns it will return updated notifiction settings
   * @author Vipin
   */
    async updateNotification(user: User, notificationDto: NotificationDto): Promise<any> {
        try {
          const walletAddress = user.walletAddress

          const updated = await this.notificationRepository.update({walletAddress},notificationDto);
          return updated
        } catch (error) {
          throw new Error(error);
        }
    }

    /**
   * @description it will show notifiction settings of login user
   * @param user
   * @returns it will return notification settings
   * @author Vipin
   */
    async getNotification(user: User): Promise<any> {
      const walletAddress = user.walletAddress
        try {
          const data = await this.notificationRepository.findOne({walletAddress});
          return data;
        } catch (error) {
          throw new Error(error);
        }
    }
}
