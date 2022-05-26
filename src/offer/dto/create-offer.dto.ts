import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Column } from 'typeorm';

export class CreateOfferDto {
  @Column()
  @ApiProperty()
  price: number;

  @Column()
  @ApiProperty()
  paymentToken: string;

  @Column()
  @ApiProperty()
  item: string;

  @Column()
  @ApiPropertyOptional()
  @IsOptional()
  auctionId: string;

  @Column()
  @ApiProperty()
  Expires: string;
}
