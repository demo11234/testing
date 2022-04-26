import { Exclude } from 'class-transformer';

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  firstName: string;

  @Column({ default: '' })
  lastName: string;

  @Column({ default: '' })
  userName: string;

  @Column({ unique: true, length: 100 })
  @Exclude({ toPlainOnly: true })
  walletAddress: string;

  @Column({ default: '' })
  email?: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: '' })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
