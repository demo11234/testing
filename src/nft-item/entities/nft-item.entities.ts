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

  @OneToOne(()=> Chains)
  @JoinColumn()
  blockChain: Chains;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({length: 1000})
  unlockableContent: string;

  @OneToOne(()=> Tokens)
  allowedTokens:Tokens[];
  
  @OneToOne(()=> Tokens)
  paymentToken: Tokens;

  @OneToOne(()=> User)
  owner: User;

  @OneToOne(()=> User)
  originalOwner: User;
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
