import { Chains } from 'src/chains/entities/chains.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { CreateDateColumn, ManyToOne, OneToMany, Column, Entity, UpdateDateColumn } from 'typeorm';
import { PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

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

  @ManyToOne(() => Collection, (collection) => collection.nftItem)
  @JoinColumn()
  collection: Collection;

  @Column({type: "simple-array",default: []})
  properties: Properties[];
    
  @Column({type: "simple-array",default: []})
  levels: Levels[];

  @Column({type: "simple-array",default: []})
  stats: Stats[];

  @Column({default: false})
  isLockable: boolean;

  @Column({default: false})
  isExplicit: boolean;
  
  @Column({ default: 1 })
  supply: number;

  @ManyToOne(()=> Chains, (chains) => chains.nftChainName)
  @JoinColumn()
  blockChain: Chains;

  @Column({length: 1000, default: ''})
  lockableContent: string;

  @Column("simple-array", {default: []})
  allowedTokens:string[];
  
  // @OneToOne(()=> Tokens)
  // paymentToken: Tokens;

  @Column({default: ''})
  owner: string;

  @Column({default: ''})
  originalOwner: string;

  @Column()
  walletAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export class Properties {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  type: string;

  @Column()
  name: string;

  @Column()
  value: string;

}

export class Levels {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string;

  @Column()
  Value: number;

  @Column()
  maxValue: number;

  @Column()
  itemId: string;
}

export class Stats {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  value: number

  @Column()
  maxValue: number;

}
