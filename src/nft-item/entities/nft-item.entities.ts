import { ApiProperty } from '@nestjs/swagger';
import { Chains } from 'src/chains/entities/chains.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { CreateDateColumn, ManyToOne, OneToMany, Column, Entity, UpdateDateColumn } from 'typeorm';
import { PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

@Entity()
export class NftItem {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty()
  @Column({nullable: false})
  fileUrl: string;
  
  @ApiProperty()
  @Column({nullable: false})
  fileName: string;

  @ApiProperty()
  @Column()
  externalUrl: string;

  @ApiProperty()
  @Column()
  description: string;

  @ManyToOne(() => Collection, (collection) => collection.nftItem)
  @JoinColumn()
  collection: Collection;

  @ApiProperty()
  @Column({type: "jsonb",default: []})
  properties: Properties[];

  @ApiProperty()
  @Column({type: "jsonb",default: []})
  levels: Levels[];

  @ApiProperty()
  @Column({type: "jsonb",default: []})
  stats: Stats[];

  @ApiProperty()
  @Column({default: false})
  isLockable: boolean;

  @ApiProperty()
  @Column({default: false})
  isExplicit: boolean;
  
  @ApiProperty()
  @Column({ default: 1 })
  supply: number;

  @ManyToOne(()=> Chains, (chains) => chains.nftChainName)
  @JoinColumn()
  blockChain: Chains;

  @ApiProperty()
  @Column({length: 1000, default: ''})
  lockableContent: string;

  @ApiProperty()
  @Column("simple-array", {default: []})
  allowedTokens:string[];

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
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column({type: 'float'})
  timeStamp: number;
}

export class Properties {
  @ApiProperty()
  type: string

  @ApiProperty()
  name: string
}

export class Levels {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  maxValue: number;
}

export class Stats {
  @ApiProperty()
  name: string

  @ApiProperty()
  value: number

  @ApiProperty()
  maxValue: number;
}
