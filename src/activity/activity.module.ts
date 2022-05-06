import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { ResponseModel } from 'src/responseModel';
import { User } from 'src/user/entities/user.entity';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, User, NftItem])],
  controllers: [ActivityController],
  providers: [ActivityService, ResponseModel],
})
export class ActivityModule {}
