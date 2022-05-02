import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { eventType } from '../enums/event-type.enum';

export class CreateActivityDto {
  @ApiProperty({
    required: true,
    description: 'Event type for activity',
    maxLength: 50,
    nullable: false,
  })
  @IsEnum(eventType)
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

  @ApiProperty({ description: 'Asset on which activity happened' })
  @IsNotEmpty()
  asset: string;

  @ApiProperty({ description: 'From account' })
  @IsOptional()
  fromAccount: string;

  @ApiProperty({ description: 'To account' })
  @IsOptional()
  toAccount: string;

  @ApiProperty({ description: 'If the activity is private' })
  isPrivate: boolean;

  @ApiProperty({ description: 'Payment token used in the activity' })
  @IsOptional()
  paymentToken: string;

  @ApiProperty({ description: 'Quantity of the asset' })
  quantity: number;

  @ApiProperty({ description: 'Total price involved' })
  totalPrice: number;

  @ApiProperty({ description: 'Collection that the activity belongs to' })
  collection: string;
}
