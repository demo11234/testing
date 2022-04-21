import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, MaxLength, IsString, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @MaxLength(50, { message: 'First Name is too long' })
  @IsString()
  firstName: string;

  @MaxLength(50, { message: 'Last Name is too long' })
  @IsString()
  lastName: string;

  @MaxLength(50, { message: 'User Name is too long' })
  userName: string;

  @IsEmail()
  email?: string;

  @IsNotEmpty()
  walletAddress: string;
}
