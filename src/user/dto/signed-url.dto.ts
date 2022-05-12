import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator';
import { s3Folder } from '../enum/s3-filepath.enum';

export class SignedUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  @IsNotEmpty()
  fileType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(s3Folder)
  filePath: s3Folder.PROFILE | s3Folder.BANNER
}