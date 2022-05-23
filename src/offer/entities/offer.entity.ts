import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { User } from 'src/user/entities/user.entity';
import { Tokens } from 'src/token/entities/tokens.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Transaction,
  UpdateDateColumn,
} from 'typeorm';

import {
  FeeMethod,
  HowToCall,
  SaleKind,
  Side,
  StatusType,
} from 'shared/Constants';
import { IsEnum } from 'class-validator';

export class Signature {
  @ApiProperty()
  Maker: string;

  @ApiProperty()
  Exchange: string;

  @ApiProperty()
  Taker: string;

  @ApiProperty()
  makerRelayerFee: number;

  @ApiProperty()
  takerRelayerFee: number;

  @ApiProperty()
  makerProtocolFee: number;

  @ApiProperty()
  takerProtocolFee: number;

  @ApiProperty()
  takerCashbackFee: number;

  @ApiProperty()
  feeRecipient: string;

  @ApiProperty()
  feeMethod: FeeMethod.PROTOCOL_FEE | FeeMethod.SPLIT_FEE;

  @ApiProperty()
  Side: Side.BUY | Side.SELL;

  @ApiProperty()
  saleKind: SaleKind.DUTCH_AUCTION | SaleKind.FIXED_PRICE;

  @ApiProperty()
  Target: string;

  @ApiProperty()
  howToCall: HowToCall.Call | HowToCall.DelegateCall;

  @ApiProperty()
  Calldata: string;

  @ApiProperty()
  replacementPattern: string;

  @ApiProperty()
  staticTarget: string;

  @ApiProperty()
  staticExtradata: string;

  @ApiProperty()
  paymentToken: string;

  @ApiProperty()
  basePrice: number;

  @ApiProperty()
  Extra: number;

  @ApiProperty()
  listingTime: number;

  @ApiProperty()
  expirationTime: number;

  @ApiProperty()
  Salt: number;

  @ApiProperty()
  Nonce: number;
}

@Entity()
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  price: number;

  @ManyToOne(() => Tokens, (tokens) => tokens.offers, {
    eager: true,
  })
  paymentToken: Tokens;

  @ManyToOne(() => User, (user) => user.offers, {
    eager: true,
  })
  @JoinColumn()
  owner: User;

  @ManyToOne(() => NftItem, (nftItem) => nftItem.offers, {
    eager: true,
  })
  @JoinColumn()
  item: NftItem;

  @ApiProperty()
  @Column()
  Expires: string;

  @Column({ default: false })
  @Exclude()
  isDeleted: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  transactionHash: string;

  @Column({ default: StatusType.CREATED, nullable: false })
  @ApiProperty()
  @IsEnum(StatusType)
  status:
    | StatusType.CREATED
    | StatusType.COMPLETED
    | StatusType.EXPIRED
    | StatusType.DELETED;

  @ApiProperty()
  @Column({ nullable: true })
  signature: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
