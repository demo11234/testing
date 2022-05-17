import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  logo: string;

  @ApiPropertyOptional({ description: 'Feature image for collection' })
  @IsString()
  @IsOptional()
  featureImage: string;

  @ApiPropertyOptional({
    description: 'Banner for collection',
  })
  @IsString()
  @IsOptional()
  banner: string;

  @ApiProperty({
    required: true,
    description: 'Name of collection',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Collection urlSlug' })
  @IsString()
  @IsOptional()
  urlSlug: string;

  @ApiPropertyOptional({
    description: 'Description about collection',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ description: 'Category for this collection' })
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiPropertyOptional({ description: 'Url of website' })
  @IsString()
  @IsOptional()
  websiteLink: string;

  @ApiPropertyOptional({ description: 'Discord Link' })
  @IsString()
  @IsOptional()
  discordLink: string;

  @ApiPropertyOptional({ description: 'Instagram Link' })
  @IsString()
  @IsOptional()
  instagramLink: string;

  @ApiPropertyOptional({ description: 'Medium Link' })
  @IsString()
  @IsOptional()
  mediumLink: string;

  @ApiPropertyOptional({ description: 'Telegram Link' })
  @IsString()
  @IsOptional()
  telegramLink: string;

  @ApiPropertyOptional({ description: 'Earning fee for Creator' })
  @IsOptional()
  earningFee: number;

  @ApiPropertyOptional({
    description: 'Earning wallet address for the collection',
  })
  @IsOptional()
  earningWalletAddress: string;

  @ApiPropertyOptional({
    description: 'blockchain being used for this collection',
  })
  @IsOptional()
  blockchain: string;

  @ApiPropertyOptional({
    description: 'Payment Token being used for this collection',
  })
  @IsOptional()
  paymentToken: string;

  @ApiPropertyOptional({
    description: 'Display Theme for collection',
    default: 'contained',
  })
  @IsEnum(displayTheme)
  @IsOptional()
  displayTheme:
    | displayTheme.CONTAINED
    | displayTheme.COVERED
    | displayTheme.PADDED;

  @ApiPropertyOptional({
    description: 'Whether information is explicit or sensitive',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  explicitOrSensitiveContent: boolean;
}
