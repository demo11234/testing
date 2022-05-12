import { uuid } from 'aws-sdk/clients/customerprofiles';
import { User } from 'src/user/entities/user.entity';
import { PrimaryGeneratedColumn } from 'typeorm';
import { OneToOne, JoinColumn } from 'typeorm';

import {
  Column,
  Entity,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(()=>User)
  @JoinColumn()
  user: User;

  @Column()
  walletAddress: string;
  
  @Column({ default: true })
  itemSold: boolean;

  @Column({ default: true })
  bidActivity: boolean;

  @Column({ default: true })
  priceChange: boolean;

  @Column({ default: true })
  auctionExpiration: boolean;

  @Column({ default: true })
  outBid: boolean;

  @Column({ default: true })
  ownedItemUpdates: boolean;

  @Column({ default: true })
  successfulPurchase: boolean;

  @Column({ default: true })
  jungleNewsletter: boolean;

  @Column({ type: 'decimal',default: 0.005 })
  minimumBidThreshold: number;
}
