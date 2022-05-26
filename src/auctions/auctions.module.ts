import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { ResponseModel } from 'src/responseModel';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './entities/auctions.entity';
import { Tokens } from 'src/token/entities/tokens.entity';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { User } from 'src/user/entities/user.entity';
import { ActivityService } from 'src/activity/activity.service';
import { Activity } from 'src/activity/entities/activity.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { Offer } from 'src/offer/entities/offer.entity';
import { NftItemService } from 'src/nft-item/nft-item.service';
import { Chains } from 'src/chains/entities/chains.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Auction,
      Tokens,
      NftItem,
      User,
      Activity,
      Collection,
      Offer,
      Chains,
    ]),
  ],
  providers: [AuctionsService, ResponseModel, ActivityService, NftItemService],
  controllers: [AuctionsController],
})
export class AuctionsModule {}
