import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({ required: true, description: 'Email of user' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  username: string;

  @ApiProperty({ required: true, description: 'Password of user' })
  @IsNotEmpty()
  password: string;
}
