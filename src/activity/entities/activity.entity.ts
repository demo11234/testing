import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { eventActions, eventType } from '../enums/activity.enum';

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
    | eventActions.CREATED
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

  @OneToOne(() => NftItem)
  @JoinColumn()
  nftItem: NftItem;

  @OneToOne(() => User)
  @JoinColumn()
  fromAccount: User;

  @OneToOne(() => User)
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

  @OneToOne(() => User)
  @JoinColumn()
  winnerAccount: User;

  @CreateDateColumn()
  @ApiProperty()
  createdDate: Date;
}

//Filters:
//eventType
//Collection : asset(item) ---> collection(name)
//Chain : asset(item) ---> chain(name)

//fromAccount ---> User(OneToOne Relation)
//toAccount ---> User(OneToOne Relation)

//asset ---> Item(OneToOne Relation)

//eventType ???
