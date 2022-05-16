import { Offer } from 'src/offer/entities/offer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Tokens {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  chainId: string;

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
  decimals: number;

  @Column()
  ethPrice: number;

  @Column()
  usdPrice: number;

  @OneToMany(() => Offer, (offer) => offer.paymentToken, {
    eager: false,
  })
  offers: Offer;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
