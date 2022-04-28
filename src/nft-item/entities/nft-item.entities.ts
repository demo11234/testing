import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { CreateDateColumn, OneToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { OneToOne, JoinColumn } from 'typeorm';

import {
  Column,
  Entity,
} from 'typeorm';

@Entity()
export class NftItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({nullable: false})
  fileUrl: string;
  
  @Column({nullable: false})
  fileName: string;

  @Column()
  externalUrl: string;

  @Column()
  description: string;

  @Column()
  // @JoinColumn()
  // @OneToMany(()=> Collection)
  collection: string;

  @Column({type: 'jsonb',default: []})
  properties: Properties[];

  @Column({type: 'jsonb',default: []})
  levels: Levels[];

  @Column({type: 'jsonb',default: []})
  stats: Stats[];

  @Column({default: false})
  unlockable: boolean;

  @Column({default: false})
  explicit: boolean;
  
  @Column({ default: 1 })
  supply: number;

  @Column()
  // @JoinColumn()
  // @OneToMany(()=> BlockChain)
  blockChain: string;

  @CreateDateColumn()
  createdAt: Date;

}

export class Properties {
  @Column()
  name: string

  @Column()
  value: string
}

export class Levels {
  @Column()
  name: string

  @Column()
  value: number

  @Column()
  valueMax: number
}

export class Stats {
  @Column()
  name: string

  @Column()
  value: number

  @Column()
  valueMax: number
}
