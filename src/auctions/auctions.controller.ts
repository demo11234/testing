import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';

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
        totalPrice: auction.startingPrice,
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
  @Get('/user/:userId')
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
  async getAuctionsByUserId(
    @Param('userId') userId: string,
    @Response() response,
  ): Promise<any> {
    try {
      const auctions = await this.auctionsService.getAuctionsByUserId(userId);
      return this.responseModel.response(
        auctions,
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

  /**
   * @description getAuctionByAuctionId will return auction details for given auction id
   * @param auctionId
   * @returns it will return auction details with given auction id
   * @author Jeetanshu Srivastava
   */
  @Get('/details/:auctionId')
  @ApiTags('Auctions Module')
  @ApiOperation({
    summary: 'Get Auctions Details By Auction Id',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.AUCTION_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  async getAuctionDetailsByAuctionId(
    @Param('auctionId') auctionId: string,
    @Response() response,
  ): Promise<any> {
    try {
      const auctionDetails =
        await this.auctionsService.getAuctionDetailsByAuctionId(auctionId);
      return this.responseModel.response(
        auctionDetails,
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

  /**
   * @description getListingByItemId will return the details of the listing of the given item id
   * @param itemId
   * @returns it will return Array of Listings
   * @author Jeetanshu Srivastava
   */
  @Get('/item/:itemId')
  @ApiTags('Auctions Module')
  @ApiOperation({
    summary: 'Get Auctions Details By Item Id',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.AUCTION_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  async getListingByItemId(
    @Param('itemId') itemId: string,
    @Response() response,
  ): Promise<any> {
    try {
      const auctions = await this.auctionsService.getListingByItemId(itemId);
      return this.responseModel.response(
        auctions,
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

  /**
   * @description getActiveListingByItemId will return the details of the active listing of the given item id
   * @param itemId
   * @returns it will return Array of Listings
   * @author Jeetanshu Srivastava
   */
  @Get('/activeitem/:itemId')
  @ApiTags('Auctions Module')
  @ApiOperation({
    summary: 'Get Active Auctions Details By Item Id',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.AUCTION_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  async getActiveListingByItemId(
    @Param('itemId') itemId: string,
    @Response() response,
  ): Promise<any> {
    try {
      const auctions = await this.auctionsService.getActiveListingByItemId(
        itemId,
      );
      return this.responseModel.response(
        auctions,
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

  /**
   * @description getAuctionByAuctionId will return auction details for given auction id
   * @param auctionId
   * @returns it will return auction details with given auction id
   * @author Jeetanshu Srivastava
   */
  @Patch('/cancel/:auctionId')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Auctions Module')
  @ApiOperation({
    summary: 'Cancel the Listing',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.AUCTION_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async cancelListing(
    @Param('auctionId') auctionId: string,
    @Response() response,
    @Request() request,
  ): Promise<any> {
    try {
      const result = await this.auctionsService.cancelListing(
        auctionId,
        request.user.walletAddress,
      );
      return this.responseModel.response(
        result.message,
        result.status,
        result.success,
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

  /**
   * @description updatePriceAndExpirationDate will update the auction
   * @param UpdateAuctionInterface
   * @returns it will return auction details
   * @author Jeetanshu Srivastava
   */
  @Post('/update')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Auctions Module')
  @ApiOperation({
    summary: 'Update the Auction Price and Expiration Date',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.AUCTION_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async updatePriceAndExpirationDate(
    @Body() updateAuctionDto: UpdateAuctionDto,
    @Response() response,
    @Request() request,
  ): Promise<any> {
    try {
      const auction = await this.auctionsService.updatePriceAndExpirationDate(
        updateAuctionDto,
      );
      await this.activityService.createActivity({
        eventActions: eventActions.LISTED,
        nftItem: auction.auction_item.id,
        eventType: eventType.LISTING,
        fromAccount: request.user.walletAddress,
        toAccount: null,
        totalPrice: auction.startingPrice,
        isPrivate: false,
        collectionId: auction.auction_collection.id,
        winnerAccount: null,
      });
      return this.responseModel.response(
        auction,
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

  /**
   * @description updateAuctionSignature will update the signature of the auction with given auctionId
   * @param CreateSignatureDto
   * @author Jeetanshu Srivastava
   */
  @Patch('/updatesignature')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Auctions Module')
  @ApiOperation({
    summary: 'Update the Signature of Auction with given Auction Id',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.AUCTION_SIGNATURE_UPDATED,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async updateAuctionSignature(
    @Body() createSignatureDto: CreateSignatureDto,
    @Response() response,
  ): Promise<any> {
    try {
      await this.auctionsService.updateAuctionSignature(createSignatureDto);
      return this.responseModel.response(
        ResponseMessage.AUCTION_SIGNATURE_UPDATED,
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
