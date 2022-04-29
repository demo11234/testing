import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateChainsDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  decimals: number;

  @ApiProperty()
  ethPrice: number;

  @ApiProperty()
  usdPrice: number;
}
