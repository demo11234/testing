import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UniqueCollectionCheck {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  url: string;
}
