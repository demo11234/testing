import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseModel } from 'src/responseModel';
import { NftItem } from './entities/nft-item.entities';
import { NftItemController } from './nft-item.controller';
import { NftItemService } from './nft-item.service';
import { FileUpload } from 'src/user/utils/s3.upload';
import { Collection } from 'src/collections/entities/collection.entity';
import { Chains } from 'src/chains/entities/chains.entity';
import { ActivityService } from 'src/activity/activity.service';
import { Activity } from 'src/activity/entities/activity.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NftItem, Collection, Chains, Activity, User]),
  ],
  controllers: [NftItemController],
  providers: [NftItemService, ResponseModel, FileUpload, ActivityService],
})
export class NftItemModule {}
