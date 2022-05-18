import { ApiPropertyOptional } from '@nestjs/swagger';

export class UniqueCollectionCheck {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  slug: string;
}
