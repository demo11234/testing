import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ConfigService } from '@nestjs/config';
import { Collection } from 'src/collections/entities/collection.entity';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, User])],
  controllers: [ServicesController],
  providers: [ServicesService, ConfigService],
})
export class ServicesModule {}
