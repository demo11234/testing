import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
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

  @ApiPropertyOptional()
  @IsString()
  @IsUrl()
  @IsOptional()
  externalUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  collectionId: string;

  @ApiPropertyOptional({type: [Properties]})
  @IsArray()
  @IsOptional()
  properties?: Properties[];

  @ApiPropertyOptional({type: [Levels]})
  @IsArray()
  @IsOptional()
  levels?: Levels[];

  @ApiPropertyOptional({type: [Stats]})
  @IsArray()
  @IsOptional()
  stats?: Stats[]

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isLockable?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lockableContent?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isExplicit?: boolean;

}