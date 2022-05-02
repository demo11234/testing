import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { eventType } from '../enums/event-type.enum';

export class ActivityFilterDto {
  @ApiProperty({
    description: 'Number of items per page',
  })
  @IsNotEmpty()
  @IsOptional()
  take: number;

  @ApiProperty({ description: 'Skip items for page number' })
  @IsOptional()
  @IsNotEmpty()
  skip: number;

  @ApiProperty({ description: 'Asset which the event is defined on' })
  @IsOptional()
  @IsNotEmpty()
  asset: string;

  @ApiProperty({ description: 'Type of event' })
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

  @ApiProperty({ description: 'Payment token used' })
  @IsOptional()
  @IsNotEmpty()
  paymentToken: string;

  @ApiProperty({ description: 'To account address' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  toAccount: string;

  @ApiProperty({ description: 'From account address' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  fromAccount: string;

  @ApiProperty({ description: 'Collection the activity is defined for' })
  @IsNotEmpty()
  @IsOptional()
  collection: string;

  @ApiProperty({ description: 'Search term to search in Activity fields' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  search: string;
}
