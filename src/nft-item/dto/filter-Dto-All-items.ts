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
    description: "give single chain id or multiple separated by ' , '",
  })
  @IsOptional()
  chainsId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  categories?: string;

  @ApiPropertyOptional()
  @IsOptional()
  onSale?: string;

  @ApiPropertyOptional({ enum: { date: 'date' } })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ enum: { asc: 'asc', desc: 'desc' } })
  @IsOptional()
  @IsString()
  order?: string;

  @ApiPropertyOptional({ description: 'no. of records per page' })
  @IsOptional()
  @IsNumberString({ message: 'value must greater than 0' })
  limit?: string;

  @ApiPropertyOptional({ description: 'page no. to view' })
  @IsOptional()
  @IsNumberString({ message: 'value must greater than 0' })
  page?: string;
}
