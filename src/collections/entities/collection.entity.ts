import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Chains } from 'src/chains/entities/chains.entity';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { Report } from 'src/report/entities/report.entities';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { displayTheme } from '../enums/display-themes.enum';

export class Stats {
  @ApiProperty()
  one_day_volume: number;

  @ApiProperty()
  one_day_change: number;

  @ApiProperty()
  one_day_sales: number;

  @ApiProperty()
  one_day_average_price: number;

  @ApiProperty()
  seven_day_volume: number;

  @ApiProperty()
  seven_day_change: number;

  @ApiProperty()
  seven_day_sales: number;

  @ApiProperty()
  seven_day_average_price: number;

  @ApiProperty()
  thirty_day_volume: number;

  @ApiProperty()
  thirty_day_change: number;

  @ApiProperty()
  thirty_day_sales: number;

  @ApiProperty()
  thirty_day_average_price: number;

  @ApiProperty()
  total_volume: number;

  @ApiProperty()
  total_sales: number;

  @ApiProperty()
  total_supply: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  num_owners: number;

  @ApiProperty()
  average_price: number;

  @ApiProperty()
  num_reports: number;

  @ApiProperty()
  market_cap: number;

  @ApiProperty()
  floor_price: number;
}

@Entity()
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ nullable: false })
  @ApiProperty()
  logo: string;

  @Column({ nullable: true })
  @ApiProperty()
  featureImage: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'watchlist',
    joinColumn: { name: 'collection_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  watchlist: User[];

  @Column({ nullable: true })
  @ApiProperty()
  banner: string;

  @Column({ unique: true, nullable: false })
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  categoryId: string;

  @ManyToOne(() => Chains, { eager: true })
  @JoinColumn()
  blockchain: Chains;

  @Column({ nullable: true, type: 'simple-array' })
  @ApiProperty()
  paymentToken: string[];

  @Column({ default: true })
  @ApiProperty()
  explicitOrSensitiveContent: boolean;

  // @Column({ nullable: true })
  // @ApiProperty()
  // url: string;

  @Column({ nullable: true })
  @ApiProperty()
  description: string;

  @Column({ default: false })
  @ApiProperty()
  isDeleted: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  websiteLink: string;

  @Column({ nullable: true })
  @ApiProperty()
  discordLink: string;

  @Column({ nullable: true })
  @ApiProperty()
  instagramLink: string;

  @Column({ nullable: true })
  @ApiProperty()
  mediumLink: string;

  @Column({ nullable: true })
  @ApiProperty()
  telegramLink: string;

  @Column({ nullable: true, type: 'decimal' })
  @ApiProperty()
  earningFee: number;

  @Column({ nullable: true })
  @ApiProperty()
  earningWalletAddress: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'collaborators',
    joinColumn: { name: 'collection_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  collaborators: User[];

  @Column({ default: displayTheme.CONTAINED })
  @ApiProperty()
  @IsEnum(displayTheme)
  displayTheme:
    | displayTheme.CONTAINED
    | displayTheme.COVERED
    | displayTheme.PADDED;

  @ManyToOne(() => User, (user) => user.collections, {
    eager: true,
  })
  @JoinColumn()
  owner: User;

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

  @Column({ unique: true, nullable: true })
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

  // @OneToMany(() => Report, (report) => report.collection)
  // @JoinColumn()
  // report: Report[];

  @Column({ default: 0 })
  @ApiProperty()
  reported: number;

  @OneToMany(() => NftItem, (nftItem) => nftItem.collection, {
    eager: true,
    cascade: true,
  })
  nftItem: Promise<NftItem[]>;

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true, default: {} })
  stats: Stats;

  @Column()
  @ApiProperty()
  ownerWalletAddress: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true, default: '' })
  objectID: string;
}
