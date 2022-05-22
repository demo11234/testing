import {
  Body,
  Request,
  Response,
  Post,
  Controller,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from 'shared/ResponseMessage';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseModel } from 'src/responseModel';
import { ReportDto } from './dto/report.dto';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly responseModel: ResponseModel,
    private readonly authService: AuthService,
  ) {}

  /**
   * @description: This api will let logedin user to report a user, item or collection
   * @param reportDto
   * @returns: success of Report
   * @author: vipin
   */
  @Post()
  @ApiTags('Report')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'logged in user can report user, item and collection',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.REQUEST_REPORTED,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: ResponseStatusCode.BAD_REQUEST,
    description: ResponseMessage.ALREADY_REPORTED,
  })
  @ApiBearerAuth()
  async report(
    @Body() reportDto: ReportDto,
    @Request() req,
    @Response() response,
  ): Promise<any> {
    try {
      const reportData = await this.reportService.findReported(req, reportDto);
      // console.log(reportData);
      if (reportData.length != 0) {
        return this.responseModel.response(
          ResponseMessage.ALREADY_REPORTED,
          ResponseStatusCode.BAD_REQUEST,
          false,
          response,
        );
      }
      await this.reportService.report(req, reportDto);
      return this.responseModel.response(
        ResponseMessage.REQUEST_REPORTED,
        ResponseStatusCode.OK,
        true,
        response,
      );
    } catch (error) {
      return this.responseModel.response(
        error,
        ResponseStatusCode.INTERNAL_SERVER_ERROR,
        false,
        response,
      );
    }
  }
}
