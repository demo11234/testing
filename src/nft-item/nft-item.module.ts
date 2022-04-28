import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftItem } from './entities/nft-item.entities';
import { NftItemController } from './nft-item.controller';
import { NftItemService } from './nft-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([NftItem])],
  controllers: [NftItemController],
  providers: [NftItemService]
})
export class NftItemModule {}
