import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class TransferItemDto {
  @ApiProperty()
  @IsString()
  userWalletAddress: string;

}