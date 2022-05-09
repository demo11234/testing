import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { displayTheme } from '../enums/display-themes.enum';

export class UpdateCollectionsDto {
  @ApiProperty({
    required: true,
    description: 'Logo for the collection',
    maxLength: 50,
    nullable: false,
  })
  @IsString()
  logo: string;

  @ApiPropertyOptional({ description: 'Feature image for collection' })
  @IsString()
  @IsOptional()
  featureImage: string;

  @ApiPropertyOptional({
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
  name: string;

  @ApiPropertyOptional({ description: 'Collection url' })
  @IsString()
  @IsOptional()
  url: string;

  @ApiPropertyOptional({
    description: 'Description about collection',
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ description: 'Category for this collection' })
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiPropertyOptional({ description: 'Url of website', maxLength: 1000 })
  @IsString()
  @IsOptional()
  websiteLink: string;

  @ApiPropertyOptional({ description: 'Discord Link', maxLength: 1000 })
  @IsString()
  @IsOptional()
  discordLink: string;

  @ApiPropertyOptional({ description: 'Instagram Link', maxLength: 1000 })
  @IsString()
  @IsOptional()
  instagramLink: string;

  @ApiPropertyOptional({ description: 'Medium Link', maxLength: 1000 })
  @IsString()
  @IsOptional()
  mediumLink: string;

  @ApiPropertyOptional({ description: 'Telegram Link', maxLength: 1000 })
  @IsString()
  @IsOptional()
  telegramLink: string;

  @ApiPropertyOptional({ description: 'Earning fee for Creator' })
  @IsOptional()
  earningFee: number;

  @ApiPropertyOptional({
    description: 'Blockchain to be used in the collection',
  })
  @IsOptional()
  blockchain: string;

  @ApiPropertyOptional({
    description: 'Payment token to be used in the collection',
  })
  @IsOptional()
  paymentToken: string;

  @ApiPropertyOptional({
    description: 'Display theme for the collection',
    default: displayTheme.CONTAINED,
  })
  @IsEnum(displayTheme)
  @IsOptional()
  displayTheme:
    | displayTheme.CONTAINED
    | displayTheme.COVERED
    | displayTheme.PADDED;

  @ApiPropertyOptional({
    description: 'Whether explicit or sensitive content',
    default: false,
  })
  @IsOptional()
  explicitOrSensitiveContent: boolean;
}
