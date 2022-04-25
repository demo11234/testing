import { ApiProperty } from '@nestjs/swagger';
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
  wishlistOwner: User[];

  @Column({ length: 50 })
  @ApiProperty()
  banner: string;

  @Column({ length: 50, nullable: false })
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  url: string;

  @Column({ length: 1000 })
  @ApiProperty()
  description: string;

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

  @Column({ length: 100 })
  @ApiProperty()
  displayTheme: string;

  @Column()
  @ApiProperty()
  contentSensitive: boolean;

  // @ManyToOne((_type) => User, (user) => user.collections, {
  // eager: false,
  // })
  @Column()
  @ApiProperty()
  owner: User;

  @Column()
  @ApiProperty()
  isVerified: boolean;

  @Column()
  @ApiProperty()
  isEditable: boolean;

  @Column()
  @ApiProperty()
  isMintable: boolean;

  @Column()
  @ApiProperty()
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
