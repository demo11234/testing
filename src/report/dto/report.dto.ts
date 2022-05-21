import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ReportReasonEnum, ReportTypeEnum } from '../enum/report.enum';

export class ReportDto {
  @ApiProperty({ description: 'id of item or collection or user' })
  @IsString()
  id: string;

  @ApiPropertyOptional({
    description: 'to add comment or message while reporting',
  })
  @IsString()
  @IsOptional()
  message: string;

  @ApiPropertyOptional({ description: 'url of collection' })
  @IsString()
  @IsOptional()
  originalCreatorUrl: string;

  @ApiProperty({
    description: 'which type of report is it eg. Spam ',
  })
  @IsEnum(ReportReasonEnum)
  reason:
    | ReportReasonEnum.EXPLICIT_SENSITIVE_CONTENT
    | ReportReasonEnum.MIGHT_BE_STOLEN
    | ReportReasonEnum.SPAM
    | ReportReasonEnum.POSSIBLE_FAKE_SCAM
    | ReportReasonEnum.OTHER;

  @ApiProperty({
    description: 'to report a item = 0 for collection = 1 & for user = 2',
  })
  @IsEnum(ReportTypeEnum)
  reportType:
    | ReportTypeEnum.ITEM
    | ReportTypeEnum.COLLECTION
    | ReportTypeEnum.USER;
}
