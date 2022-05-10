import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterDto {
  @ApiPropertyOptional({
    description: 'Number of items per page',
  })
  @IsOptional()
  take: number;

  @ApiPropertyOptional({ description: 'Skip items for page number' })
  @IsOptional()
  skip: number;

  @ApiPropertyOptional({ description: 'Earning Wallet id of the collection' })
  @IsOptional()
  earningWalletAddress: string;

  @ApiPropertyOptional({ description: 'name of the collection' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ description: 'status' })
  @IsString()
  @IsOptional()
  status: string;

  @ApiPropertyOptional({ description: 'isVerified value for collection' })
  @IsOptional()
  isVerified: boolean;

  @ApiPropertyOptional({
    description: 'Search term to search in collection fields',
  })
  @IsString()
  @IsOptional()
  search: string;
}
