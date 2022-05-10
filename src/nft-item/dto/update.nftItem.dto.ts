import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Levels, Properties, Stats } from '../entities/nft-item.entities';
import { Type as ValidateType } from 'class-transformer';

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
  collectionId?: string;

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

  @ApiProperty()
  @IsBoolean()
  isLockable: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lockableContent?: string;

  @ApiProperty()
  @IsBoolean()
  isExplicit: boolean;
}

