import { Exclude } from 'class-transformer';
import { Collection } from 'src/collections/entities/collection.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
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

  @Column({ default: '' })
  bannerUrl: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  twitterHandle: string;

  @Column({ default: '' })
  instagramHandle: string;

  @Column({ default: '' })
  website: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Collection, (collection) => collection.owner, {
    eager: false,
  })
  @JoinColumn()
  collections: Collection[];

  @ManyToMany(() => Collection, (collection) => collection.collaborators, {
    eager: false,
  })
  @JoinColumn()
  collaboratedCollection: Collection[];
}
