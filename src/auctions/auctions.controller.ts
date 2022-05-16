import {
  Body,
  Controller,
  Get,
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
import { eventActions, eventType } from 'shared/Constants';
import { ResponseMessage } from 'shared/ResponseMessage';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { ActivityService } from 'src/activity/activity.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseModel } from 'src/responseModel';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Controller('auctions')
export class AuctionsController {
  constructor(
    private readonly auctionsService: AuctionsService,
    private readonly responseModel: ResponseModel,
    private readonly activityService: ActivityService,
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
    description: ResponseMessage.AUCTION_DETAILS,
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
      await this.activityService.createActivity({
        eventActions: eventActions.LISTED,
        nftItem: createAuctionDto.auction_items,
        eventType: eventType.LISTING,
        fromAccount: request.user.walletAddress,
        toAccount: null,
        totalPrice: null,
        isPrivate: false,
        collectionId: createAuctionDto.auction_collection,
        winnerAccount: null,
      });
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

  /**
   * @description getAuctionByUserId will return auction details for given user id
   * @param userId
   * @returns it will return auction with given user id
   * @author Jeetanshu Srivastava
   */
  @Get('/user')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Auctions Module')
  @ApiOperation({
    summary: 'Get Auctions By User Id',
  })
  @ApiResponse({
    status: ResponseStatusCode.CREATED,
    description: ResponseMessage.AUCTION_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async getAuctionsByUserId(
    @Response() response,
    @Request() request,
  ): Promise<any> {
    try {
      const auctions = await this.auctionsService.getAuctionsByUserId(
        request.user.walletAddress,
      );
      return this.responseModel.response(
        auctions,
        ResponseStatusCode.OK,
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
