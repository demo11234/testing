import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class LivePriceDto {
  @Column()
  @ApiProperty()
  cryptoName: string[];

  @Column()
  @ApiProperty()
  currencies: string[];
}
