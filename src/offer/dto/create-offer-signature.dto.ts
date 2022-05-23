import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Signature } from '../entities/offer.entity';

export class CreateOfferSignatureDto {
  @ApiProperty()
  @IsNotEmpty()
  offerId: string;

  @ApiProperty()
  @IsNotEmpty()
  signature: Signature;
}
