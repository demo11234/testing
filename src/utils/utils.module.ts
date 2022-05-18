import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/admin/entities/categories.entity';
import { Chains } from 'src/chains/entities/chains.entity';
import { CollectionsService } from 'src/collections/collections.service';
import { Collection } from 'src/collections/entities/collection.entity';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { ResponseModel } from 'src/responseModel';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UtilsService } from './utils.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection, User, NftItem, Chains, Category]),
  ],
  providers: [UtilsService, CollectionsService, ResponseModel, Repository],
  exports: [UtilsService],
})
export class UtilsModule {}
