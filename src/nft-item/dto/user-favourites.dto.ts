import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserFavouritesDto {
  @ApiProperty()
  @IsNotEmpty()
  isFavourite: boolean;

  @ApiProperty()
  @IsNotEmpty()
  itemId: string;
}
