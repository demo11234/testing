import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Levels, Properties, Stats } from '../entities/nft-item.entities';
import { Type as ValidateType } from 'class-transformer';
import { Column } from 'typeorm';

export class CreateNftItemDto {
  @ApiProperty()
  @IsString()
  @IsUrl({ message: 'file URL is not valid.' })
  fileUrl: string;

  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  externalUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  previewImage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  collectionId: string;

  @ApiPropertyOptional({ description: 'properties', type: [Properties] })
  @IsArray()
  @IsOptional()
  @ValidateNested()
  @ValidateType(() => Properties)
  properties?: Properties[];

  @ApiPropertyOptional({ description: 'Levels', type: [Levels] })
  @IsArray()
  @IsOptional()
  @ValidateNested()
  @ValidateType(() => Levels)
  levels?: Levels[];

  @ApiPropertyOptional({ description: 'Stats', type: [Stats] })
  @IsArray()
  @IsOptional()
  @ValidateNested()
  @ValidateType(() => Stats)
  stats?: Stats[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isLockable?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lockableContent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isExplicit?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  supply?: number;

  @ApiProperty()
  @IsString()
  blockChainId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contractAddress?: string;
}
