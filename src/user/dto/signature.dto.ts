import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SignatureDto {
  @ApiProperty()
  @IsString()
  wallet_address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  signature?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  signature_message?: string;
}
