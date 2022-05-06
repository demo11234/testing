import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Levels, Properties, Stats } from '../entities/nft-item.entities';
// import { Stats } from '../entities/stats-entites';

export class NftItemDto {
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

  @ApiProperty()
  //@IsArray()
  @IsOptional()
  properties: Properties[];

  @ApiProperty()
  //@IsArray()
  @IsOptional()
  levels: Levels[];

  @ApiProperty()
  //@IsArray()
  @IsOptional()
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
