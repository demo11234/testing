import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { ResponseModel } from 'src/responseModel';
import { User } from 'src/user/entities/user.entity';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { Collection } from './entities/collection.entity';
import { Category } from 'src/admin/entities/categories.entity';
import { UserRepository } from 'src/user/repositories/user.repository';
import { NotificationService } from 'src/notification/notification.service';
import { FileUpload } from 'src/user/utils/s3.upload';
import { Notification } from 'src/notification/entity/notification.entity';
import { ConfigService } from '@nestjs/config';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { Chains } from 'src/chains/entities/chains.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Collection,
      Category,
      User,
      UserRepository,
      Notification,
      NftItem,
      Chains,
    ]),
  ],
  controllers: [CollectionsController],
  providers: [
    CollectionsService,
    UserService,
    NotificationService,
    ConfigService,
    ResponseModel,
    FileUpload,
  ],
})
export class CollectionsModule {}
