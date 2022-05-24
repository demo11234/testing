import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AcceptOfferDto {
  @ApiProperty()
  @IsString()
  offerID: string;

  @ApiProperty()
  @IsString()
  transactionHash: string;

  @ApiProperty()
  @IsString()
  url: string;
}
