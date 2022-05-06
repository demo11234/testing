import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusEnum } from '../enum/filter.status.enum';

export class FilterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  walletAddress: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @ApiProperty()
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsOptional()
  collectionsId?: string;

  @ApiProperty()
  @IsOptional()
  chainsId?: string;

  @ApiProperty()
  @IsOptional()
  categories?: string;

  @ApiProperty()
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
