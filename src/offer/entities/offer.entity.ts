import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  price: number;

  @Column()
  @ApiProperty()
  paymentToken: string;

  @ManyToOne(() => User, (user) => user.offers, {
    eager: false,
  })
  @JoinColumn()
  owner: User;

  @Column()
  @ApiProperty()
  item: string;

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
