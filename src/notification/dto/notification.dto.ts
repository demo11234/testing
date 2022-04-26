import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber } from 'class-validator';

export class NotificationDto {
  @ApiProperty()
  @IsBoolean()
  itemSold?: boolean;

  @ApiProperty()
  @IsBoolean()
  bidActivity?: boolean;

  @ApiProperty()
  @IsBoolean()
  priceChange?: boolean;

  @ApiProperty()
  @IsBoolean()
  auctionExpiration?: boolean;

  @ApiProperty()
  @IsBoolean()
  outBid?: boolean;

  @ApiProperty()
  @IsBoolean()
  ownedItemUpdates?: boolean;

  @ApiProperty()
  @IsBoolean()
  successfulPurchase?: boolean;

  @ApiProperty()
  @IsBoolean()
  jungleNewsletter?: boolean;

  @ApiProperty()
  @IsNumber()
  minimumBidThreshold?: number;

}