import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Column } from 'typeorm';
import { Signature } from '../entities/offer.entity';

export class CreateOfferDto {
  @ApiProperty()
  price: number;

  @ApiProperty()
  paymentToken: string;

  @ApiProperty()
  item: string;

  @ApiProperty({ description: 'Unix timestamp value for expiration window' })
  Expires: number;

  @ApiProperty()
  @IsNotEmpty()
  signature: Signature;
}
