import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
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
import { UserService } from 'src/user/user.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferFilterDto } from './dto/offer-filter.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferService } from './offer.service';

@Controller('offer')
export class OfferController {
  constructor(
    private readonly offerService: OfferService,
    private readonly responseModel: ResponseModel,
    private readonly userService: UserService
  ) {}

  /**
   * @description: 'This api creates new offer by the user who is logged in'
   * @param createOfferDto
   * @returns: 'Created Offer'
   * @author: 'Ansh Arora
   */
  @Post()
  @ApiTags('Offer Module')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Creates a new offer on an item by logged in user',
  })
  @ApiResponse({
    status: ResponseStatusCode.CREATED,
    description: ResponseMessage.OFFER_CREATED,
  })
  @ApiResponse({
    status: ResponseStatusCode.CONFLICT,
    description: ResponseMessage.BAD_REQUEST_OFFER_CREATION,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req,
    @Response() response,
  ) {
    try {
      const ownerWalletAddress = req.user.walletAddress;
      const offer = await this.offerService.createOffer(
        createOfferDto,
        ownerWalletAddress,
      );
      if (offer) {
        return this.responseModel.response(
          offer,
          ResponseStatusCode.CREATED,
          true,
          response,
        );
      } else {
        return this.responseModel.response(
          ResponseMessage.BAD_REQUEST_OFFER_CREATION,
          ResponseStatusCode.CONFLICT,
          false,
          response,
        );
      }
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
   * @description: This api updates the collection and returns status
   * @param id
   * @param updateCollectionDto
   * @returns: Update Staus
   * @author: Ansh Arora
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Offer Module')
  @ApiOperation({
    summary:
      'Update Offer Details on an item by user who is currenlty Logged In',
  })
  @ApiResponse({
    status: ResponseStatusCode.CONFLICT,
    description: ResponseMessage.BAD_REQUEST_OFFER_UPDATE,
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: 'Offer Details',
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
    @Response() response,
  ) {
    try {
      const offer = await this.offerService.findOne(id);
      if (req.user.id === offer.owner) {
        const updatedOffer = await this.offerService.update(id, updateOfferDto);
        if (updatedOffer) {
          return this.responseModel.response(
            updatedOffer,
            ResponseStatusCode.OK,
            true,
            response,
          );
        }
      } else {
        return this.responseModel.response(
          ResponseMessage.BAD_REQUEST_OFFER_UPDATE,
          ResponseStatusCode.BAD_REQUEST,
          false,
          response,
        );
      }
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
   * @description: This api gets all the offers based on filter and paginates them
   * @returns: Matching offers
   * @author: Ansh Arora
   */
  @Get('/getOffers')
  @ApiTags('Offer Module')
  @ApiOperation({
    summary:
      'Update Offer Details on an item by user who is currenlty Logged In',
  })
  @ApiResponse({
    status: ResponseStatusCode.CONFLICT,
    description: ResponseMessage.OFFERS_DO_NOT_EXIST,
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: 'Offer Details',
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  async getOffers(
    @Query() offerFilterDto: OfferFilterDto,
    @Response() response,
  ) {
    try {
      offerFilterDto.take =
        offerFilterDto.take >= 20 ? 20 : offerFilterDto.take;
      if (!offerFilterDto.skip) {
        offerFilterDto.skip === 0;
      }
      const offer = await this.offerService.getOffers(offerFilterDto);
      if (offer) {
        return this.responseModel.response(
          offer,
          ResponseStatusCode.OK,
          true,
          response,
        );
      } else {
        return this.responseModel.response(
          ResponseMessage.OFFERS_DO_NOT_EXIST,
          ResponseStatusCode.NOT_FOUND,
          false,
          response,
        );
      }
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
   * @description: This api soft deletes the offer
   * @returns: Null
   * @author: Ansh Arora
   */
  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Offer Module')
  @ApiOperation({
    summary:
      'Update Offer Details on an item by user who is currenlty Logged In',
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: ResponseStatusCode.CONFLICT,
    description: ResponseMessage.USER_DOES_NOT_OWN_OFFER,
  })
  @ApiBearerAuth()
  async delete(@Param() id: string, @Response() response, @Req() req) {
    try {
      const offer = await this.offerService.findOne(id);
      const owner = await this.userService.findUserByWalletAddress(
        req.user.walletAddress,
      );
      if (!offer.owner === owner.id) {
        return this.responseModel.response(
          ResponseMessage.USER_DOES_NOT_OWN_OFFER,
          ResponseStatusCode.CONFLICT,
          false,
          response,
        );
      }
      await this.offerService.delete(id);
      return this.responseModel.response(
        ResponseMessage.OFFER_REMOVED,
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
