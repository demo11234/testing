import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { eventType } from '../enums/activity.enum';

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
  eventType: [string];

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsOptional()
  collectionId: string[];

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsOptional()
  chain: string[];
}
