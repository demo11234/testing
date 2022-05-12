import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class NotificationDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  itemSold?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  bidActivity?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  priceChange?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  auctionExpiration?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  outBid?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  ownedItemUpdates?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  successfulPurchase?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  jungleNewsletter?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  minimumBidThreshold?: number;
}
