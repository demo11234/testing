import { Chains } from 'src/chains/entities/chains.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import {
  CreateDateColumn,
  ManyToOne,
  Column,
  Entity,
  UpdateDateColumn,
} from 'typeorm';
import { PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

@Entity()
export class NftItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  fileUrl: string;

  @Column({ nullable: false })
  fileName: string;

  @Column({ default: '' })
  externalUrl: string;

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => Collection, (collection) => collection.nftItem)
  @JoinColumn()
  collection: Collection;

  // @OneToMany(()=> Properties)
  @Column({ type: 'jsonb', default: [] })
  properties: Properties[];

  @Column({ type: 'jsonb', default: [] })
  levels: Levels[];

  @Column({ type: 'jsonb', default: [] })
  stats: Stats[];

  @Column({ default: false })
  isLockable: boolean;

  @Column({ default: false })
  isExplicit: boolean;

  @Column({ default: 1 })
  supply: number;

  @ManyToOne(() => Chains, (chains) => chains.nftChainName)
  @JoinColumn()
  blockChain: Chains;

  @Column({ length: 1000, default: '' })
  lockableContent: string;

  @Column('simple-array', { default: [] })
  allowedTokens: string[];

  @Column({ default: '' })
  owner: string;

  @Column({ default: '' })
  originalOwner: string;

  @Column()
  walletAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export class Properties {
  type: string;
  name: string;
}

export class Levels {
  name: string;
  value: number;
  maxValue: number;
}

export class Stats {
  name: string;
  value: number;
  maxValue: number;
}
