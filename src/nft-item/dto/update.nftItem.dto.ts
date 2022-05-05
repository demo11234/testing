import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
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
  collectionId: string;

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
  isLockable: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lockableContent: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isExplicit: boolean;

}