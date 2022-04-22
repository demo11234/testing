import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
  @IsNotEmpty()
  featureImage: string;

  //   @ApiProperty({
  //     description: 'Banner for collection',
  //     maxLength: 50,
  //   })
  //   @IsString()
  //   banner: string;

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
  url: string;

  @ApiProperty({ description: 'Description about collection', maxLength: 1000 })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Url of website', maxLength: 1000 })
  @IsString()
  websiteLink: string;

  @ApiProperty({ description: 'Discord Link', maxLength: 1000 })
  @IsString()
  discordLink: string;

  @ApiProperty({ description: 'Instagram Link', maxLength: 1000 })
  @IsString()
  instagramLink: string;

  @ApiProperty({ description: 'Medium Link', maxLength: 1000 })
  @IsString()
  mediumLink: string;

  @ApiProperty({ description: 'Telegram Link', maxLength: 1000 })
  @IsString()
  telegramLink: string;

  @ApiProperty({ description: 'Earning fee for Creator' })
  earningFee: number;

  @ApiProperty({ description: 'Display Theme for collection', maxLength: 100 })
  displayTheme: string;

  //   @ApiProperty({ description: 'slug for collection', maxLength: 250 })
  //   @IsString()
  //   slug: string;
}
