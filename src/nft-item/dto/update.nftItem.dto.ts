import { ApiProperty } from '@nestjs/swagger';
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
  fileUrl?: string;

  @ApiProperty()
  @IsString()
  fileName?: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  @IsOptional()
  externalUrl?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  collectionId?: string;

  @ApiProperty({ description: 'properties', type: [Properties] })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  @ValidateNested()
  @ValidateType(() => Properties)
  properties?: Properties[];

  @ApiProperty({ description: 'Levels', type: [Levels] })
  //@IsArray()
  @IsOptional()
  levels?: Levels[];

  @ApiProperty({ description: 'Stats', type: [Stats] })
  //@IsArray()
  @IsOptional()
  stats?: Stats[];

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isLockable?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lockableContent?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isExplicit?: boolean;
}
