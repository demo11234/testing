import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNumber, IsString, IsUrl } from 'class-validator';
import { Chains } from 'src/chains/entities/chains.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { Levels, Properties, Stats } from '../entities/nft-item.entities';
// import { Stats } from '../entities/stats-entites';

export class NftItemDto {
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
  externalUrl: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  collectionId: string;
  // collection: Collection;

  @ApiProperty()
  @IsArray()
  properties: Properties[];

  @ApiProperty()
  @IsArray()
  levels: Levels[];

  @ApiProperty()
  @IsArray()
  stats: Stats[]

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