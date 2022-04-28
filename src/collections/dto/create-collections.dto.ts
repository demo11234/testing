import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { displayTheme } from '../enums/display-themes.enum';

export class CreateCollectionsDto {
  @ApiProperty({
    required: true,
    description: 'Logo for the collection',
    maxLength: 50,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  logo: string;

  @ApiProperty({ description: 'Feature image for collection' })
  @IsString()
  @IsOptional()
  featureImage: string;

  @ApiProperty({
    description: 'Banner for collection',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  banner: string;

  @ApiProperty({
    required: true,
    description: 'Name of collection',
    maxLength: 50,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Collection url' })
  @IsString()
  @IsOptional()
  url: string;

  @ApiProperty({ description: 'Description about collection', maxLength: 1000 })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'Category for this collection' })
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiProperty({ description: 'Url of website', maxLength: 1000 })
  @IsString()
  @IsOptional()
  websiteLink: string;

  @ApiProperty({ description: 'Discord Link', maxLength: 1000 })
  @IsString()
  @IsOptional()
  discordLink: string;

  @ApiProperty({ description: 'Instagram Link', maxLength: 1000 })
  @IsString()
  @IsOptional()
  instagramLink: string;

  @ApiProperty({ description: 'Medium Link', maxLength: 1000 })
  @IsString()
  @IsOptional()
  mediumLink: string;

  @ApiProperty({ description: 'Telegram Link', maxLength: 1000 })
  @IsString()
  @IsOptional()
  telegramLink: string;

  @ApiProperty({ description: 'Earning fee for Creator' })
  @IsOptional()
  earningFee: number;

  @ApiProperty({ description: 'blockchain being used for this collection' })
  @IsOptional()
  blockchain: string;

  @ApiProperty({ description: 'Payment Token being used for this collection' })
  @IsOptional()
  paymentToken: string;

  @ApiProperty({ description: 'Display Theme for collection', maxLength: 100 })
  @IsEnum(displayTheme)
  @IsOptional()
  displayTheme:
    | displayTheme.CONTAINED
    | displayTheme.COVERED
    | displayTheme.PADDED;

  @ApiProperty({ description: 'Whether information is explicit or sensitive' })
  @IsBoolean()
  @IsOptional()
  explicitOrSensitiveContent: boolean; //
}
