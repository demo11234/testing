import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { eventType } from '../enums/event-type.enum';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  @IsEnum(eventType)
  eventType:
    | eventType.APPROVE
    | eventType.BID_ENTERED
    | eventType.BID_WITHDRAWN
    | eventType.CANCELLED
    | eventType.CREATED
    | eventType.OFFER_ENTERED
    | eventType.SUCCESSFUL
    | eventType.TRANSFER;

  @Column()
  @ApiProperty()
  asset: string;

  @CreateDateColumn()
  @ApiProperty()
  createdDate: Date;

  @Column()
  @ApiProperty()
  fromAccount: string;

  @Column()
  @ApiProperty()
  toAccount: string;

  @Column()
  @ApiProperty()
  isPrivate: boolean;

  @Column()
  @ApiProperty()
  paymentToken: string;

  @Column()
  @ApiProperty()
  quantity: number;

  @Column()
  @ApiProperty()
  totalPrice: number;

  @Column()
  @ApiProperty()
  collection: string;
}
