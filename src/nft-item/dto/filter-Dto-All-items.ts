import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusEnum } from '../enum/filter.status.enum';

export class FilterDtoAllItems {
  @ApiPropertyOptional({
    description:
      "give single or multiple input from 'new', 'buynow', 'onAuction', 'hasOffer' seprated by ' , '",
  })
  @IsOptional()
  // @IsEnum(StatusEnum)
  status?: string;

  @ApiPropertyOptional({
    description: 'give price type eg. usdPrice, ethPrice ',
    enum: { usdPrice: 'usdPrice', ethPrice: 'ethPrice' },
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
    description: "give patmentToken Id separated by ' , '  eg.(1, 10) ",
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
    description:
      "give single chain id or multiple separated by ' , ' like MATIC, Eth",
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
