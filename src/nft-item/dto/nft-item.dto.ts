
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

export class CreateNftItemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl(undefined, { message: 'file URL is not valid.' })
  fileUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  fileName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()

  @IsUrl(undefined, { message: 'external URL is not valid.' })
  externalUrl: string;

  @ApiPropertyOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  collectionId: string;

  @ApiProperty({ description: 'properties', type: [Properties] })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  @ValidateNested()
  @ValidateType(() => Properties)
  properties: Properties[];

  @ApiProperty({ description: 'Levels', type: [Levels] })
  //@IsArray()
  @IsOptional()
  @ValidateNested()
  @ValidateType(() => Levels)
  levels: Levels[];

  @ApiProperty({ description: 'Stats', type: [Stats] })
  //@IsArray()
  @IsOptional()
  @ValidateNested()
  @ValidateType(() => Stats)
  stats: Stats[];

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
}
