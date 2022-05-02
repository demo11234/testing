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

  @Column({default: ''})
  externalUrl: string;

  @Column({default: ''})
  description: string;

  @Column({default: ''})
  collection: string;
  // @ManyToOne(() => Collection, (collection) => collection.nftItem, {onDelete: 'SET NULL'})
  // @JoinColumn({name: 'collection_id'})
  // collection: Collection;

  @Column({type: "simple-array",default: []})
  properties: Properties[];

  @Column({type: "simple-array",default: []})
  levels: Levels[];

  @Column({type: "simple-array",default: []})
  stats: Stats[];

  @Column({default: false})
  unlockable: boolean;

  @Column({default: false})
  explicit: boolean;
  
  @Column({ default: 1 })
  supply: number;

  // @ManyToOne(()=> Chains, (chains) => chains.nftChainName)
  @Column({ default: '' })
  blockChain: string;

  @Column({length: 1000, default: ''})
  unlockableContent: string;

  @Column("simple-array", {default: []})
  allowedTokens:string[];
  
  // @OneToOne(()=> Tokens)
  // paymentToken: Tokens;

  @Column({default: ''})
  owner: string;

  // @OneToOne(()=> User)
  // originalOwner: User;

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
