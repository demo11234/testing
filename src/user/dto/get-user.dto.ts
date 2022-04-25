import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator';

export class WalletAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  walletAddress: string;
}

export class UserNameDto {
    @ApiProperty()
    @IsNotEmpty()
    userName: string;
}
  