import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Notification } from './entity/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseModel } from 'src/responseModel';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [NotificationService, ResponseModel],
})
export class NotificationModule {}
