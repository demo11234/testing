import {
  Column,
  CreateDateColumn,
  Entity,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
