import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
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

  @Column({ default: '' })
  tokenId: string;

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

// export class Properties {
//   type: string;
//   name: string;
// }

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
  value: number;
  @ApiProperty()
  maxValue: number;
}

export class Stats {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  value: number;
  @ApiProperty()
  maxValue: number;
}
