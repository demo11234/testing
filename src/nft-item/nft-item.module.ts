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
import { JwtModule } from '@nestjs/jwt';
import { Constants } from 'shared/Constants';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/user/repositories/user.repository';
import { Auction } from 'src/auctions/entities/auctions.entity';
import { Offer } from 'src/offer/entities/offer.entity';
import { Tokens } from 'src/token/entities/tokens.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.register({
      secret: Constants.JWT_SECRET_KEY,
      signOptions: { expiresIn: Constants.USER_TOKEN_VALIDITY },
    }),
    TypeOrmModule.forFeature([
      NftItem,
      Collection,
      Chains,
      Activity,
      User,
      Auction,
      Offer,
      Tokens,
    ]),
  ],
  controllers: [NftItemController],
  providers: [
    NftItemService,
    ResponseModel,
    FileUpload,
    ActivityService,
    AuthService,
    UserRepository,
    ConfigService,
  ],
})
export class NftItemModule {}
