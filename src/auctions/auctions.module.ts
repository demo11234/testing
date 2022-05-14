import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { ResponseModel } from 'src/responseModel';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './entities/auctions.entity';
import { Tokens } from 'src/token/entities/tokens.entity';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, Tokens, NftItem, User])],
  providers: [AuctionsService, ResponseModel],
  controllers: [AuctionsController],
})
export class AuctionsModule {}
