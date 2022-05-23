import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Collection } from 'src/collections/entities/collection.entity';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReportReasonEnum, ReportTypeEnum } from '../enum/report.enum';

@Entity()
export class Report {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ApiProperty()
  @ManyToOne(() => Collection)
  @JoinColumn()
  collection: Collection;

  @ApiProperty()
  @ManyToOne(() => NftItem)
  @JoinColumn()
  item: NftItem;

  @ApiProperty({ description: 'wallet addres of user' })
  @Column({ nullable: true })
  reportedById: string;

  @ApiProperty()
  @Column({ default: true })
  active: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  @IsEnum(ReportTypeEnum)
  reportType:
    | ReportTypeEnum.ITEM
    | ReportTypeEnum.COLLECTION
    | ReportTypeEnum.USER;

  @ApiProperty()
  @Column({ nullable: true })
  message: string;

  @ApiProperty()
  @Column({ nullable: true })
  originalCreatorUrl: string;

  @ApiProperty()
  @IsEnum(ReportReasonEnum)
  @Column({ nullable: true })
  reason:
    | ReportReasonEnum.EXPLICIT_SENSITIVE_CONTENT
    | ReportReasonEnum.MIGHT_BE_STOLEN
    | ReportReasonEnum.SPAM
    | ReportReasonEnum.POSSIBLE_FAKE_SCAM
    | ReportReasonEnum.OTHER;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;
}
