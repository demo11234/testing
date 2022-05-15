import { ApiPropertyOptional } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class UpdateOfferDto {
  @Column()
  @ApiPropertyOptional()
  price: number;

  @Column()
  @ApiPropertyOptional()
  paymentToken: string;

  @Column()
  @ApiPropertyOptional()
  Expires: string;
}
