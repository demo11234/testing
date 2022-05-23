import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Chains } from 'src/chains/entities/chains.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { User } from 'src/user/entities/user.entity';
import { Offer } from 'src/offer/entities/offer.entity';
import {
  CreateDateColumn,
  ManyToOne,
  Column,
  Entity,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Auction } from 'src/auctions/entities/auctions.entity';
import { Report } from 'src/report/entities/report.entities';

export class BiddingEnabled {
  @ApiProperty({ default: false })
  @IsBoolean()
  isEnabled: boolean;

  @ApiProperty()
  reason: string;
}

export class Properties {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class Levels {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsNumber()
  maxValue: number;
}

export class Stats {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsNumber()
  maxValue: number;
}

@Entity()
export class NftItem {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  tokenId: string;

  @ApiProperty()
  @Column({ nullable: false })
  fileUrl: string;

  @ApiProperty()
  @Column({ nullable: false })
  fileName: string;

  @ApiProperty()
  @Column({ nullable: true })
  externalUrl: string;

  @ApiProperty()
  @Column({ nullable: true })
  previewImage: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Collection, (collection) => collection.nftItem, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  collection: Collection;

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  properties: Properties[];

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  levels: Levels[];

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  stats: Stats[];

  @ApiProperty()
  @Column({ default: false })
  isLockable: boolean;

  @ApiProperty()
  @Column({ default: false })
  isExplicit: boolean;

  @ApiProperty()
  @Column({ default: 1 })
  supply: number;

  @OneToMany(() => Offer, (offer) => offer.item, {
    eager: false,
  })
  @JoinColumn()
  offers: Offer[];

  @ManyToOne(() => Chains, (chains) => chains.nftChainName, { eager: true })
  @JoinColumn()
  blockChain: Chains;

  @OneToMany(() => Auction, (auction_item) => auction_item.auction_item)
  @JoinColumn()
  auction_item: Auction[];

  @ApiProperty()
  @Column({ nullable: true })
  lockableContent: string;

  @ApiProperty()
  @Column('simple-array', { default: [] })
  allowedTokens: string[];

  @ApiProperty()
  @Column()
  owner: string;

  @ApiProperty()
  @Column()
  originalOwner: string;

  @ApiProperty()
  @Column()
  walletAddress: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'favourites',
    joinColumn: { name: 'item_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  favourites: User[];

  @ApiProperty()
  @Column({ default: false })
  buyNow: boolean;

  @ApiProperty()
  @Column({ default: false })
  onAuction: boolean;

  @ApiProperty()
  @Column({ default: false })
  hasOffer: boolean;

  @ApiProperty()
  @Column({ default: false })
  hasCashback: boolean;

  @ApiProperty()
  @Column({ default: false })
  isFreezed?: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  hash?: string;

  @ApiProperty()
  @Column({ nullable: true })
  contractAddress: string;

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  isBiddingEnabled: BiddingEnabled;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column({ type: 'float' })
  timeStamp: number;

  @ApiProperty()
  @Column({ nullable: true, default: 0 })
  views: number;

  @ApiProperty()
  @Column({ nullable: true, type: 'decimal', default: 0 })
  cashback: number;

  // @OneToMany(() => Report, (report) => report.item)
  // @JoinColumn()
  // report: Report[];

  @Column({ default: 0 })
  @ApiProperty()
  reported: number;

  @DeleteDateColumn()
  deletedAt: Date;
}

