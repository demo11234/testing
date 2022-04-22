import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
// import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ length: 50 })
  @ApiProperty()
  firstName: string;

  @Column({ length: 50 })
  @ApiProperty()
  lastName: string;

  @Column({ length: 100, nullable: true, unique: true })
  @ApiProperty()
  username: string;

  @Column({ nullable: true })
  @ApiProperty()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ default: false })
  active: boolean;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
