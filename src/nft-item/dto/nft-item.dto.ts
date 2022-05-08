import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNumber, IsString, IsUrl, IsOptional} from 'class-validator';
import { Levels, Properties, Stats } from '../entities/nft-item.entities';


export class CreateNftItemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl()
  fileUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  fileName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl()
  externalUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  collectionId: string;

  @ApiPropertyOptional({type: [Properties]})
  @IsOptional()
  @IsArray()
  properties?: Properties[];

  @ApiPropertyOptional({type: [Levels]})
  @IsOptional()
  @IsArray()
  levels?: Levels[];

  @ApiPropertyOptional({type: [Stats]})
  @IsOptional()
  @IsArray()
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
}
