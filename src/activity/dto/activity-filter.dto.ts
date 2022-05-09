import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { eventType } from '../../../shared/Constants';

export class ActivityFilterDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsOptional()
  take: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  skip: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  eventType: eventType[];

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsOptional()
  collectionId: string[];

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsOptional()
  chain: string[];
}
