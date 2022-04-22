import { ApiProperty } from '@nestjs/swagger'
import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, MaxLength, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @MaxLength(50, { message: 'First Name is too long' })
  @IsString()
  firstName: string;

  @ApiProperty()
  @MaxLength(50, { message: 'Last Name is too long' })
  @IsString()
  lastName: string;

  @ApiProperty()
  @MaxLength(50, { message: 'User Name is too long' })
  userName: string;

  @ApiProperty()
  @IsEmail()
  email?: string;
}
