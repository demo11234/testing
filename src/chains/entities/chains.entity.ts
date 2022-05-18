import { Collection } from 'src/collections/entities/collection.entity';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { OneToMany } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Chains {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  imageUrl: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column()
  baseUrl: string;

  @Column()
  decimals: number;

  @Column()
  ethPrice: number;

  @Column()
  usdPrice: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => NftItem, (nftItem) => nftItem.blockChain)
  nftChainName: NftItem;
}
