import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusEnum } from '../enum/filter.status.enum';

export class FilterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  walletAddress: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @ApiPropertyOptional()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  // @IsArray()
  @IsOptional()
  @ApiProperty()
  collectionsId?: string;

  @ApiPropertyOptional()
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
}
