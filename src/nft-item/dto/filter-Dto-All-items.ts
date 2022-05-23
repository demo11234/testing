import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterDtoAllItems {
  @ApiPropertyOptional({
    description:
      "give single or multiple input from 'new', 'buynow', 'onAuction', 'hasOffer', 'hasCashback' seprated by ' , '",
  })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'give price type eg. usd, eth',
    enum: { usd: 'usd', eth: 'eth' },
  })
  @IsOptional()
  @IsString()
  priceType?: string;

  @ApiPropertyOptional({
    description: "give price value range separated by ' , '  eg.(1, 10) ",
  })
  @IsOptional()
  @IsString()
  priceRange?: string;

  @ApiPropertyOptional({
    description: "give patmentToken  separated by ' , '  eg.(Eth, MATIC) ",
  })
  @IsOptional()
  @IsString()
  paymentTokens?: string;

  @ApiPropertyOptional({
    description: "give single collection id or multiple separated by ' , '",
  })
  @IsOptional()
  @ApiProperty()
  collectionsId?: string;

  @ApiPropertyOptional({
    description: "give single chain id or multiple separated by ' , '",
  })
  @IsOptional()
  chainsId?: string;

  @ApiPropertyOptional({
    description: 'only accepts single category Id',
  })
  @IsOptional()
  categories?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isBundle?: boolean;

  @ApiPropertyOptional({ description: 'search by name of item' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: {
      recentlyCreated: 'recentlyCreated',
      oldest: 'oldest',
      endingSoon: 'endingSoon',
      endDate: 'endDate',
      recentlyListed: 'recentlyListed',
      HighestLastSale: 'HighestLastSale',
      priceH2L: 'priceH2L',
      priceL2H: 'priceL2H',
      recentlyReceived: 'recentlyReceived',
    },
  })
  @IsOptional()
  @IsString()
  order?: string;

  @ApiPropertyOptional()
  @IsOptional()
  take?: number;

  @ApiPropertyOptional()
  @IsOptional()
  skip?: number;
}
