import { ApiProperty } from '@nestjs/swagger';
import { IsHexadecimal, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsHexadecimal()
  walletAddress: string;
}
