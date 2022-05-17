import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FeesPaidDto {
  @ApiProperty()
  @IsNotEmpty()
  isOneTimeFees: boolean;

  @ApiProperty()
  @IsNotEmpty()
  oneTimeFees: string;
}
