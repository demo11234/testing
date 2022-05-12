import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsService } from 'src/collections/collections.service';
import { Collection } from 'src/collections/entities/collection.entity';
import { ResponseModel } from 'src/responseModel';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UtilsService } from './utils.service';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, User])],
  providers: [UtilsService, CollectionsService, ResponseModel, Repository],
  exports: [UtilsService],
})
export class UtilsModule {}
