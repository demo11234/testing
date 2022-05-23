import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Signature } from '../entities/auctions.entity';

export class CreateSignatureDto {
  @ApiProperty()
  @IsNotEmpty()
  auctionId: string;

  @ApiProperty()
  @IsNotEmpty()
  signature: Signature;
}
