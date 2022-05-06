import { ApiPropertyOptional } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class OfferFilterDto {
  @Column()
  @ApiPropertyOptional()
  item: string;

  @Column()
  @ApiPropertyOptional()
  user: string;

  @Column()
  @ApiPropertyOptional()
  take: number;

  @Column()
  @ApiPropertyOptional()
  skip: number;
}
