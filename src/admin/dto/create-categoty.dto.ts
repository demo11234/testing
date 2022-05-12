import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    required: true,
    description: 'New category name to be created',
  })
  @IsString()
  @MinLength(3, {
    message: 'category name is too short',
  })
  @IsNotEmpty()
  categoryName: string;

  @ApiProperty({ required: true, description: 'category pic url' })
  @IsUrl()
  @IsString({ message: 'Category url can not be only numbers' })
  @IsNotEmpty()
  categoryImageUrl: string;
}
