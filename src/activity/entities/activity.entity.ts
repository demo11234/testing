import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { eventActions, eventType } from 'shared/Constants';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  @IsEnum(eventActions)
  eventActions:
    | eventActions.APPROVE
    | eventActions.BID_ENTERED
    | eventActions.BID_WITHDRAWN
    | eventActions.CANCELLED
    | eventActions.MINTED
    | eventActions.OFFER_ENTERED
    | eventActions.SUCCESSFUL
    | eventActions.TRANSFER;

  @Column()
  @ApiProperty()
  @IsEnum(eventType)
  eventType:
    | eventType.BIDS
    | eventType.LISTING
    | eventType.SALES
    | eventType.TRANSFERS;

  @ManyToOne(() => NftItem)
  @JoinColumn()
  nftItem: NftItem;

  @ManyToOne(() => User)
  @JoinColumn()
  fromAccount: User;

  @ManyToOne(() => User)
  @JoinColumn()
  toAccount: User;

  @Column()
  @ApiProperty()
  isPrivate: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  totalPrice: number;

  @Column()
  @ApiProperty()
  collectionId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  winnerAccount: User;

  @CreateDateColumn()
  @ApiProperty()
  createdDate: Date;
}
