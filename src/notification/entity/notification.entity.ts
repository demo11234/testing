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

  // @OneToOne(()=>User)
  // @JoinColumn()
  // user: User;

  @Column()
  walletAddress: string;
  
  @Column({ default: false })
  itemSold: boolean;

  @Column({ default: false })
  bidActivity: boolean;

  @Column({ default: false })
  priceChange: boolean;

  @Column({ default: false })
  auctionExpiration: boolean;

  @Column({ default: false })
  outBid: boolean;

  @Column({ default: false })
  ownedItemUpdates: boolean;

  @Column({ default: false })
  successfulPurchase: boolean;

  @Column({ default: false })
  jungleNewsletter: boolean;

  @Column({ type: 'decimal',default: 0.005 })
  minimumBidThreshold: number;
}
