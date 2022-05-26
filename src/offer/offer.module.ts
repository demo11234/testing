import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityService } from 'src/activity/activity.service';
import { Activity } from 'src/activity/entities/activity.entity';
import { Category } from 'src/admin/entities/categories.entity';
import { Auction } from 'src/auctions/entities/auctions.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { Notification } from 'src/notification/entity/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { ResponseModel } from 'src/responseModel';

import { Tokens } from 'src/token/entities/tokens.entity';
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
      NftItem,
      Activity,
      Tokens,
      Auction,
    ]),
  ],
  controllers: [OfferController],
  providers: [
    OfferService,
    ResponseModel,
    UserService,
    NotificationService,
    FileUpload,
    ConfigService,
    ActivityService,
  ],
})
export class OfferModule {}
