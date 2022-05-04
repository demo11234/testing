import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { eventType } from '../enums/event-type.enum';

export class ActivityFilterDto {
  @ApiPropertyOptional({
    description: 'Number of items per page',
  })
  @IsNotEmpty()
  @IsOptional()
  take: number;

  @ApiPropertyOptional({ description: 'Skip items for page number' })
  @IsOptional()
  @IsNotEmpty()
  skip: number;

  @ApiPropertyOptional({ description: 'Asset which the event is defined on' })
  @IsOptional()
  @IsNotEmpty()
  asset: string;

  @ApiPropertyOptional({ description: 'Type of event' })
  @IsOptional()
  @IsNotEmpty()
  eventType:
    | eventType.APPROVE
    | eventType.BID_ENTERED
    | eventType.BID_WITHDRAWN
    | eventType.CANCELLED
    | eventType.CREATED
    | eventType.OFFER_ENTERED
    | eventType.SUCCESSFUL
    | eventType.TRANSFER;

  @ApiPropertyOptional({ description: 'Payment token used' })
  @IsOptional()
  @IsNotEmpty()
  paymentToken: string;

  @ApiPropertyOptional({ description: 'To account address' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  toAccount: string;

  @ApiPropertyOptional({ description: 'From account address' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  fromAccount: string;

  @ApiPropertyOptional({
    description: 'Collection the activity is defined for',
  })
  @IsNotEmpty()
  @IsOptional()
  collection: string;

  @ApiPropertyOptional({
    description: 'Search term to search in Activity fields',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  search: string;
}
