import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { StatusEnum } from '../enum/filter.status.enum';

export class FilterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  walletAddress: string;

  @ApiPropertyOptional({
    description:
      "give single or multiple input from 'new', 'buynow', 'onAuction', 'hasOffer', 'hasCashback' seprated by ' , '",
  })
  @IsOptional()
  // @IsEnum(StatusEnum)
  status?: string;

  @ApiPropertyOptional({
    description: 'give price type eg. usd, eth',
    enum: { usd: 'usd', eth: 'eth' },
  })
  @IsOptional()
  @IsString()
  priceType?: string;

  @ApiPropertyOptional({
    description: "give price value range seprated by ' , '  eg.(1, 10) ",
  })
  @IsOptional()
  @IsString()
  priceRange?: string;

  @ApiPropertyOptional({
    description: "give single collection id or multiple seprated by ' , '",
  })
  @IsOptional()
  @ApiProperty()
  collectionsId?: string;

  @ApiPropertyOptional({
    description: "give single chain id or multiple seprated by ' , '",
  })
  @IsOptional()
  chainsId?: string;

  @ApiPropertyOptional({
    description: 'give categories id',
  })
  @IsOptional()
  categories?: string;

  @ApiPropertyOptional({
    description: "give single token id or multiple seprated by ' , '",
  })
  @IsOptional()
  onSale?: string;

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
      mostFavourited: 'mostFavourited',
    },
  })
  @IsOptional()
  @IsString()
  order?: string;

  @ApiPropertyOptional({ description: 'no. of records per page' })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'page no. to view' })
  @IsOptional()
  page?: number;
}
