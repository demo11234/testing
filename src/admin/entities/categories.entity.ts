import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ length: 50, nullable: true, unique: true })
  @ApiProperty()
  categoryName: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ default: false })
  categoryStatus: boolean;

  @Column({ length: 50 })
  @ApiProperty()
  @IsUrl()
  categoryImageUrl: string;

  @Column({ length: 50, unique: true })
  @ApiProperty()
  categorySlug: string;

  @Column({ default: '' })
  @ApiProperty()
  createdBy: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
