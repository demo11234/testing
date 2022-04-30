import { Chains } from 'src/chains/entities/chains.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { Tokens } from 'src/token/entities/tokens.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { UpdateDateColumn } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { OneToOne, JoinColumn } from 'typeorm';

import {
  Column,
  Entity,
} from 'typeorm';

@Entity()
export class NftItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({nullable: false})
  fileUrl: string;
  
  @Column({nullable: false})
  fileName: string;

  @Column()
  externalUrl: string;

  @Column()
  description: string;

  @ManyToOne(() => Collection, (collection) => collection.nftItem, {onDelete: 'SET NULL'})
  @JoinColumn({name: 'collection_id'})
  collection: Collection;

  @Column({type: 'jsonb',default: []})
  properties: Properties[];

  @Column({type: 'jsonb',default: []})
  levels: Levels[];

  @Column({type: 'jsonb',default: []})
  stats: Stats[];

  @Column({default: false})
  unlockable: boolean;

  @Column({default: false})
  explicit: boolean;
  
  @Column({ default: 1 })
  supply: number;

  @ManyToOne(()=> Chains, (chains) => chains.nftChainName)
  blockChain: Chains;

  @Column({length: 1000})
  unlockableContent: string;

  @Column()
  allowedTokens:string[];
  
  @OneToOne(()=> Tokens)
  paymentToken: Tokens;

  @Column()
  owner: string;

  @OneToOne(()=> User)
  originalOwner: User;

  @Column()
  ownerId: string;

  @Column()
  walletAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export class Properties {
  @Column()
  name: string

  @Column()
  value: string
}

export class Levels {
  @Column()
  name: string

  @Column()
  value: number

  @Column()
  valueMax: number
}

export class Stats {
  @Column()
  name: string

  @Column()
  value: number

  @Column()
  valueMax: number
}
