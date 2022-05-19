import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { findOfferByUserType } from 'shared/Constants';

export class FindOfferByUserDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  recievedOrSent: findOfferByUserType.RECIEVED | findOfferByUserType.SENT;
}
