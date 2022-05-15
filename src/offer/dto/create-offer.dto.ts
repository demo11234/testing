import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  Expires: string;
}
