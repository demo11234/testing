import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChainsTokensDto {
  @ApiProperty()
  @IsNotEmpty()
  chainId: string;
}
