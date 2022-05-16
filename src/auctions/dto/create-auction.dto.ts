import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { auctionType, timedAuctionMethod } from 'shared/Constants';
import { Bundle, ReservedAuction } from '../entities/auctions.entity';

export class CreateAuctionDto {
  @ApiProperty()
  @IsNotEmpty()
  auction_items: string;

  @ApiProperty()
  @IsNotEmpty()
  auction_collection: string;

  @ApiProperty()
  @IsNotEmpty()
  startDate: number;

  @ApiProperty()
  @IsNotEmpty()
  endDate: number;

  @ApiProperty()
  @IsNotEmpty()
  tokens: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(auctionType)
  auctionType: auctionType.FIXED_PRICE | auctionType.TIMED_AUCTION;

  @ApiPropertyOptional()
  @IsOptional()
  bundle: Bundle;

  @ApiPropertyOptional()
  @IsOptional()
  reservedAuction: ReservedAuction;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  startingPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  endingPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  reservedPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(timedAuctionMethod)
  timedAuctionMethod:
    | timedAuctionMethod.SELL_TO_HIGHEST_BIDDER
    | timedAuctionMethod.SELL_WITH_DECLINING_PRICE;
}
