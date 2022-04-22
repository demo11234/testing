import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ required: true, description: 'firstname of user' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ required: true, description: 'lastname of user' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ required: true, description: 'Email of user' })
  @IsEmail()
  @IsString({ message: 'Email can not be only numbers' })
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'password must contain minimum of 6 characters' })
  @MaxLength(32, { message: 'password must contain maximum of 32 characters' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Weak Password',
  })
  @ApiProperty({ required: true, description: 'Password user wants provide' })
  password: string;
}
