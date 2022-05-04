import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { displayTheme } from '../enums/display-themes.enum';

@Entity()
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ length: 50, nullable: false })
  @ApiProperty()
  logo: string;

  @Column({ length: 50, nullable: true })
  @ApiProperty()
  featureImage: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'watchlist',
    joinColumn: { name: 'collection_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  watchlist: User[];

  @Column({ length: 50 })
  @ApiProperty()
  banner: string;

  @Column({ unique: true, length: 50, nullable: false })
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  categoryID: string;

  @Column({ nullable: true })
  @ApiProperty()
  blockchain: string;

  @Column({ nullable: true })
  @ApiProperty()
  paymentToken: string;

  @Column({ nullable: true })
  @ApiProperty()
  explicitOrSensitiveContent: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  url: string;

  @Column({ length: 1000, nullable: true })
  @ApiProperty()
  description: string;

  @Column({ default: false })
  @ApiProperty()
  isDeleted: boolean;

  @Column({ length: 1000, nullable: true })
  @ApiProperty()
  websiteLink: string;

  @Column({ length: 1000, nullable: true })
  @ApiProperty()
  discordLink: string;

  @Column({ length: 1000, nullable: true })
  @ApiProperty()
  instagramLink: string;

  @Column({ length: 1000, nullable: true })
  @ApiProperty()
  mediumLink: string;

  @Column({ length: 1000, nullable: true })
  @ApiProperty()
  telegramLink: string;

  @Column({ nullable: true })
  @ApiProperty()
  earningFee: number;

  @Column({ nullable: true })
  @ApiProperty()
  earningWalletAddress: string;

  @Column({ type: 'jsonb', default: [] })
  @ApiProperty()
  collaborators: string[];

  @Column({ length: 100, default: displayTheme.CONTAINED })
  @ApiProperty()
  @IsEnum(displayTheme)
  displayTheme:
    | displayTheme.CONTAINED
    | displayTheme.COVERED
    | displayTheme.PADDED;

  // @ManyToOne((_type) => User, (user) => user.collections, {
  // eager: false,
  // })
  @Column({ nullable: true })
  @ApiProperty()
  owner: string;

  @Column({ default: false })
  @ApiProperty()
  isVerified: boolean;

  @Column({ default: true })
  @ApiProperty()
  isEditable: boolean;

  @Column({ default: true })
  @ApiProperty()
  isMintable: boolean;

  @Column({ nullable: true })
  @ApiProperty({ default: false })
  isSafelisted: boolean;

  @Column({ length: 250, nullable: true })
  @ApiProperty()
  slug: string;

  @Column({ nullable: true })
  @ApiProperty()
  status: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
