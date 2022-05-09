import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FilterDto {
  @ApiProperty({
    description: 'Number of items per page',
  })
  @IsNotEmpty()
  @IsOptional()
  take: number;

  @ApiPropertyOptional({ description: 'Skip items for page number' })
  @IsOptional()
  @IsNotEmpty()
  skip: number;

  @ApiPropertyOptional({ description: 'Earning Wallet id of the collection' })
  @IsNotEmpty()
  earningWalletAddress: string;

  @ApiPropertyOptional({ description: 'name of the collection' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'status' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  status: string;

  @ApiPropertyOptional({ description: 'isVerified value for collection' })
  @IsNotEmpty()
  @IsOptional()
  isVerified: boolean;

  @ApiPropertyOptional({
    description: 'Search term to search in collection fields',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  search: string;
}
