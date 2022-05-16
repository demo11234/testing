import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAuctionDto {
  @ApiProperty()
  @IsNotEmpty()
  auctionId: string;

  @ApiPropertyOptional()
  @Optional()
  @IsNotEmpty()
  endDate: number;

  @ApiPropertyOptional()
  @IsNumber()
  price: number;
}
