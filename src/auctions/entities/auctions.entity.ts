import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { auctionType, timedAuctionMethod } from 'shared/Constants';
import { Tokens } from '../../../src/token/entities/tokens.entity';
import { NftItem } from '../../../src/nft-item/entities/nft-item.entities';
import { User } from 'src/user/entities/user.entity';
import { Collection } from 'src/collections/entities/collection.entity';

export class Bundle {
  @ApiProperty()
  isBundle: boolean;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsOptional()
  description: string;
}

export class ReservedAuction {
  @ApiProperty()
  isReservedAuction: boolean;

  @ApiProperty()
  walletAddress: string;
}

@Entity()
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ nullable: false })
  @ApiProperty()
  auctionName: string;

  @ManyToOne(() => NftItem)
  @JoinColumn()
  auction_item: NftItem;

  @ManyToOne(() => Collection)
  @JoinColumn()
  auction_collection: Collection;

  @Column({ type: 'float' })
  @ApiProperty()
  startDate: number;

  @Column({ type: 'float' })
  @ApiProperty()
  endDate: number;

  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;

  @ManyToOne(() => Tokens)
  @JoinColumn()
  tokens: Tokens;

  @Column({ default: auctionType.FIXED_PRICE, nullable: false })
  @ApiProperty()
  @IsEnum(auctionType)
  auctionType: auctionType.FIXED_PRICE | auctionType.TIMED_AUCTION;

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  bundle: Bundle;

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  reservedAuction: ReservedAuction;

  @Column({ nullable: true, type: 'decimal' })
  @ApiProperty()
  startingPrice: number;

  @Column({ nullable: true, type: 'decimal' })
  @ApiProperty()
  endingPrice: number;

  @Column({ nullable: true, type: 'decimal' })
  @ApiProperty()
  reservedPrice: number;

  @Column({
    nullable: true,
  })
  @ApiProperty()
  @IsEnum(timedAuctionMethod)
  timedAuctionMethod:
    | timedAuctionMethod.SELL_TO_HIGHEST_BIDDER
    | timedAuctionMethod.SELL_WITH_DECLINING_PRICE;

  @Column({ default: true })
  @ApiProperty()
  isActive: boolean;

  @Column({ default: false })
  @ApiProperty()
  isCancelled: boolean;

  @Column({ default: 0 })
  @ApiProperty()
  quantity: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
