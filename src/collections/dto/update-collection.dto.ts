import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
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
  name: string;

  @ApiProperty({ description: 'Collection url' })
  @IsString()
  @IsOptional()
  url: string;

  @ApiProperty({ description: 'Description about collection', maxLength: 1000 })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Category assigned to the collection',
    maxLength: 50,
  })
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

  @ApiProperty({ description: 'Collaborators on  the collection' })
  @IsOptional()
  collaborators: string;

  @ApiProperty({ description: 'Blockchain to be used in the collection' })
  @IsOptional()
  blockchain: string;

  @ApiProperty({ description: 'Payment token to be used in the collection' })
  @IsOptional()
  paymentToken: string;

  @ApiProperty({
    description: 'Display theme for the collection',
    default: displayTheme.CONTAINED,
  })
  @IsEnum(displayTheme)
  @IsOptional()
  displayTheme:
    | displayTheme.CONTAINED
    | displayTheme.COVERED
    | displayTheme.PADDED;

  @ApiProperty({
    description: 'Whether explicit or sensitive content',
    default: false,
  })
  @IsOptional()
  explicitOrSensitiveContent: boolean;
}
