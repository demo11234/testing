import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserWatchlistDto {
  @ApiProperty()
  @IsNotEmpty()
  isWatched: boolean;

  @ApiProperty()
  collectionId: string;
}
