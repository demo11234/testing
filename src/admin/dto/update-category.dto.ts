import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-categoty.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
