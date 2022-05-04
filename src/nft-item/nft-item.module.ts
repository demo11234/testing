import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseModel } from 'src/responseModel';
import { NftItem } from './entities/nft-item.entities';
import { NftItemController } from './nft-item.controller';
import { NftItemService } from './nft-item.service';
import { FileUpload } from 'src/user/utils/s3.upload';
import { Collection } from 'src/collections/entities/collection.entity';
import { Chains } from 'src/chains/entities/chains.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NftItem, Collection, Chains])],
  controllers: [NftItemController],
  providers: [
    NftItemService,
    ResponseModel,
    FileUpload,
  ]
})
export class NftItemModule {}
