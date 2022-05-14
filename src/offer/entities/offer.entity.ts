import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { User } from 'src/user/entities/user.entity';
import { Tokens } from 'src/token/entities/tokens.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { truncate } from 'fs';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  price: number;

  @ManyToOne(() => Tokens, (tokens) => tokens.offers, {
    eager: true,
  })
  paymentToken: Tokens;

  @ManyToOne(() => User, (user) => user.offers, {
    eager: true,
  })
  @JoinColumn()
  owner: User;

  @ManyToOne(() => NftItem, (nftItem) => nftItem.offers, {
    eager: true,
  })
  @JoinColumn()
  item: NftItem;

  @Column()
  Expires: string;

  @Column({ default: false })
  @Exclude()
  isDeleted: boolean;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
