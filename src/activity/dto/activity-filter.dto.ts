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

  @ApiPropertyOptional({
    description:
      'eventType must be comma seperated. Event Type: Listing, Sales, Bids, Transfers',
  })
  @IsOptional()
  @IsNotEmpty()
  eventType: eventType;

  @ApiPropertyOptional({
    description: 'collectionId must be comma seperated',
  })
  @IsNotEmpty()
  @IsOptional()
  collectionId: string;

  @ApiPropertyOptional({
    description: 'chain must be comma seperated',
  })
  @IsNotEmpty()
  @IsOptional()
  chain: string;
}
