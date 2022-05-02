import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
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

  @Column({ length: 50 })
  @ApiProperty()
  featureImage: string;

  // @ManyToMany((_type) => User, (user) => user.id, {
  //   eager: false,
  // })
  @Column()
  @ApiProperty()
  watchlist: User[];

  @Column({ length: 50 })
  @ApiProperty()
  banner: string;

  @Column({ unique: true, length: 50, nullable: false })
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  categoryID: string;

  @Column()
  @ApiProperty()
  blockchain: string;

  @Column()
  @ApiProperty()
  paymentToken: string;

  @Column()
  @ApiProperty()
  explicitOrSensitiveContent: boolean;

  @Column()
  @ApiProperty()
  url: string;

  @Column({ length: 1000 })
  @ApiProperty()
  description: string;

  @Column({ default: false })
  @ApiProperty()
  isDeleted: boolean;

  @Column({ length: 1000 })
  @ApiProperty()
  websiteLink: string;

  @Column({ length: 1000 })
  @ApiProperty()
  discordLink: string;

  @Column({ length: 1000 })
  @ApiProperty()
  instagramLink: string;

  @Column({ length: 1000 })
  @ApiProperty()
  mediumLink: string;

  @Column({ length: 1000 })
  @ApiProperty()
  telegramLink: string;

  @Column()
  @ApiProperty()
  earningFee: number;

  @Column()
  @ApiProperty()
  earningWalletAddress: string;

  @Column()
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
  @Column()
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

  @Column()
  @ApiProperty({ default: false })
  isSafelisted: boolean;

  @Column({ length: 250 })
  @ApiProperty()
  slug: string;

  @Column()
  @ApiProperty()
  status: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
