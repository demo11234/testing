import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseModel } from 'src/responseModel';
import { User } from 'src/user/entities/user.entity';
import { Offer } from './entities/offer.entity';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, User])],
  controllers: [OfferController],
  providers: [OfferService, ResponseModel],
})
export class OfferModule {}
