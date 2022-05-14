import {
  Body,
  Controller,
  Post,
  Request,
  Response,
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseModel } from 'src/responseModel';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Controller('auctions')
export class AuctionsController {
  constructor(
    private readonly auctionsService: AuctionsService,
    private readonly responseModel: ResponseModel,
  ) {}

  /**
   * @description createAuction will create new auction
   * @param CreateAuctionDto
   * @returns it will return created auction details
   * @author Jeetanshu Srivastava
   */
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Auctions Module')
  @ApiOperation({
    summary: 'Create new Auctions',
  })
  @ApiResponse({
    status: ResponseStatusCode.CREATED,
    description: ResponseMessage.CHAIN_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async createAuction(
    @Body() createAuctionDto: CreateAuctionDto,
    @Response() response,
    @Request() request,
  ): Promise<any> {
    try {
      const auction = await this.auctionsService.createAuctions(
        createAuctionDto,
        request.user.walletAddress,
      );
      return this.responseModel.response(
        auction,
        ResponseStatusCode.CREATED,
        true,
        response,
      );
    } catch (error) {
      console.log(error);
      return this.responseModel.response(
        error,
        ResponseStatusCode.INTERNAL_SERVER_ERROR,
        false,
        response,
      );
    }
  }
}
