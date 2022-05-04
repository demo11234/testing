import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseModel } from 'src/responseModel';
import { User } from 'src/user/entities/user.entity';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { Collection } from './entities/collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, User])],
  controllers: [CollectionsController],
  providers: [CollectionsService, ResponseModel],
})
export class CollectionsModule {}
