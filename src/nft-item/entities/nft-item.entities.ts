import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Chains } from 'src/chains/entities/chains.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import {
  CreateDateColumn,
  ManyToOne,
  Column,
  Entity,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

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

  @ManyToOne(() => Collection, (collection) => collection.nftItem,
  {onDelete: "CASCADE", eager: true})
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

  @ManyToOne(() => Chains, (chains) => chains.nftChainName)
  @JoinColumn()
  blockChain: Chains;

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

  @ApiProperty()
  @Column({default: false})
  buyNow: boolean;

  @ApiProperty()
  @Column({default: false})
  onAuction: boolean;

  @ApiProperty()
  @Column({default: false})
  hasOffer: boolean;

  @ApiProperty()
  @Column({default: false})
  isFreezed?: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column({ type: 'float' })
  timeStamp: number;

  @DeleteDateColumn()
  deletedAt: Date;
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
