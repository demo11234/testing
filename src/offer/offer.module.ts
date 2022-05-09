import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/admin/entities/categories.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { Notification } from 'src/notification/entity/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { ResponseModel } from 'src/responseModel';
import { ServicesService } from 'src/services/services.service';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserService } from 'src/user/user.service';
import { FileUpload } from 'src/user/utils/s3.upload';
import { Offer } from './entities/offer.entity';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Offer,
      User,
      Category,
      UserRepository,
      Notification,
      Collection,
    ]),
  ],
  controllers: [OfferController],
  providers: [
    OfferService,
    ResponseModel,
    UserService,
    NotificationService,
    ServicesService,
    FileUpload,
    ConfigService,
  ],
})
export class OfferModule {}
