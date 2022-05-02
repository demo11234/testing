import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Chains } from 'src/chains/entities/chains.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { Levels, Properties, Stats } from '../entities/nft-item.entities';

export class UpdateNftItemDto {
  @ApiProperty()
  @IsString()
  @IsUrl()
  fileUrl: string;

  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  @IsOptional()
  externalUrl: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  collection: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  properties: Properties[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  levels: Levels[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  stats: Stats[]

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  unlockable: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  unlockableContent: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  explicit: boolean;

}