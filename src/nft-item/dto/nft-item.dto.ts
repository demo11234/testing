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
  @ApiProperty()
  @IsString()
  @IsUrl(undefined, { message: 'file URL is not valid.' })
  fileUrl: string;

  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  @IsUrl(undefined, { message: 'external URL is not valid.' })
  externalUrl: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  collectionId: string;
  // collection: Collection;

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

  @ApiProperty()
  @IsBoolean()
  isLockable: boolean;

  @ApiProperty()
  @IsString()
  lockableContent: string;

  @ApiProperty()
  @IsBoolean()
  isExplicit: boolean;

  @ApiProperty()
  @IsNumber()
  supply: number;

  @ApiProperty()
  @IsString()
  blockChainId: string;
}
