import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FilterDto {
  @ApiProperty({
    description: 'Number of items per page',
  })
  @IsNotEmpty()
  @IsOptional()
  take: number;

  @ApiProperty({ description: 'Skip items for page number' })
  @IsOptional()
  @IsNotEmpty()
  skip: number;

  @ApiProperty({ description: 'Earning Wallet id of the collection' })
  @IsOptional()
  @IsNotEmpty()
  earningWalletAddress: string;

  @ApiProperty({ description: 'name of the collection' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'status' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  status: string;

  @ApiProperty({ description: 'isVerified value for collection' })
  @IsNotEmpty()
  @IsOptional()
  isVerified: boolean;

  @ApiProperty({ description: 'Search term to search in collection fields' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  search: string;
}
