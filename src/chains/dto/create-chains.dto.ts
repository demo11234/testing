import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator';

export class CreateChainsDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  decimals: number;

  @ApiProperty()
  @IsNotEmpty()
  ethPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  usdPrice: number;
}
