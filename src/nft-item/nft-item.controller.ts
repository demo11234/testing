import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  Param,
  Patch,
  UseGuards,
  Query,
  ValidationPipe,
  UsePipes,
  Put,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from 'shared/ResponseMessage';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { ActivityService } from 'src/activity/activity.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseModel } from 'src/responseModel';
import { FilterDto } from './dto/filter.dto';
import { CreateNftItemDto } from './dto/nft-item.dto';
import { UpdateNftItemDto } from './dto/update.nftItem.dto';
import { NftItemService } from './nft-item.service';
import { eventType, eventActions } from '../../shared/Constants';
import { FilterDtoAllItems } from './dto/filter-Dto-All-items';
import { Delete } from '@nestjs/common';
import { TransferItemDto } from './dto/transferItem.dto';
import { UserFavouritesDto } from './dto/user-favourites.dto';
import 'dotenv/config';
import { AuthService } from 'src/auth/auth.service';
import { UpdateCashbackDto } from './dto/updatecashback.dto';

@Controller('nft-item')
@UsePipes(ValidationPipe)
export class NftItemController {
  constructor(
    private readonly nftItemService: NftItemService,
    private readonly responseModel: ResponseModel,
    private readonly activityService: ActivityService,
    private readonly authService: AuthService,
  ) {}

  /**
   * @description: This api create the item and returns status
   * @param CreateNftItemDto
   * @returns: create Item
   * @author: vipin
   */
  @ApiTags('Nft Item')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'it will create new nft item' })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: 'Nft Created',
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: ResponseStatusCode.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST,
  })
  @ApiBearerAuth()
  @Post('create')
  async createNftItem(
    @Body() nftItemDto: CreateNftItemDto,
    @Request() req,
    @Response() response,
  ): Promise<any> {
    try {
      const user = req.user;
      const create = await this.nftItemService.createNftItem(user, nftItemDto);
      if (!create) {
        return this.responseModel.response(
          ResponseMessage.SELECT_COLLECTION,
          ResponseStatusCode.BAD_REQUEST,
          false,
          response,
        );
      }
      await this.activityService.createActivity({
        eventActions: eventActions.MINTED,
        nftItem: create.id,
        eventType: eventType.TRANSFERS,
        fromAccount: process.env.MINTING_ACCOUNT_ADDRESS,
        toAccount: req.user.walletAddress,
        totalPrice: null,
        isPrivate: create?.isExplicit ?? false,
        collectionId: nftItemDto.collectionId,
        winnerAccount: null,
      });
      if (create)
        return this.responseModel.response(
          create,
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
   * @description: This api fetch item and returns status
   * @param FilterDto
   * @returns: fetch Items with filters
   * @author: vipin
   */
  @ApiTags('Nft Item')
  @ApiOperation({ summary: 'it will fetch nft item' })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: 'Nft Fetch',
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.ITEM_NOT_FOUND,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @Get()
  async fetchNftItems(
    @Query() filterDto: FilterDto,
    @Response() response,
  ): Promise<any> {
    try {
      const find = await this.nftItemService.fetchNftItems(filterDto);
      if (find.length === 0) {
        return this.responseModel.response(
          ResponseMessage.ITEM_NOT_FOUND,
          ResponseStatusCode.NOT_FOUND,
          false,
          response,
        );
      } else {
        return this.responseModel.response(
          find,
          ResponseStatusCode.OK,
          true,
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
   * @description: This api updates the item and returns status
   * @param id
   * @param UpdateNftItemDto
   * @returns: Update Item
   * @author: vipin
   */
  @ApiTags('Nft Item')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'it will update nft item' })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: 'Nft updated',
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.ITEM_NOT_FOUND,
  })
  @ApiResponse({
    status: ResponseStatusCode.BAD_REQUEST,
    description: ResponseMessage.USER_DOES_NOT_OWN_ITEM,
  })
  @ApiResponse({
    status: ResponseStatusCode.BAD_REQUEST,
    description: ResponseMessage.ITEM_IS_FREEZED,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  @Patch(':id')
  async updateNftItems(
    @Param('id') id: string,
    @Body() updateNftItemDto: UpdateNftItemDto,
    @Request() req,
    @Response() response,
  ): Promise<any> {
    try {
      const item = await this.nftItemService.findOne(id);
      if (item.isFreezed === true) {
        return this.responseModel.response(
          ResponseMessage.ITEM_IS_FREEZED,
          ResponseStatusCode.BAD_REQUEST,
          false,
          response,
        );
      }
      if (!item)
        return this.responseModel.response(
          ResponseMessage.ITEM_NOT_FOUND,
          ResponseStatusCode.NOT_FOUND,
          false,
          response,
        );
      if (req.user.walletAddress === item.owner) {
        const updateItem = await this.nftItemService.updateNftItems(
          id,
          updateNftItemDto,
        );
        return this.responseModel.response(
          updateItem,
          ResponseStatusCode.OK,
          true,
          response,
        );
      } else {
        return this.responseModel.response(
          ResponseMessage.USER_DOES_NOT_OWN_ITEM,
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
   * @description: favourites adds or removes user from favourites depending upon the value of isFavourite
   * @param UserWatchlistDto
   * @returns: Updates Status
   * @author Jeetanshu Srivastava
   */
  @Put('/favourites')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Nft Item')
  @ApiOperation({
    summary: 'Add and Removes user wallet address from favourites of a item',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.FAVOURITES_ADDED,
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.FAVOURITES_REMOVED,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async favourites(
    @Body() userFavouritesDto: UserFavouritesDto,
    @Response() response,
    @Request() request,
  ): Promise<any> {
    try {
      const { isFavourite } = userFavouritesDto;
      if (isFavourite) {
        const result = await this.nftItemService.addUserInFavourites(
          request.user.walletAddress,
          userFavouritesDto.itemId,
        );
        return this.responseModel.response(
          result,
          ResponseStatusCode.OK,
          true,
          response,
        );
      } else {
        const result = await this.nftItemService.removeUseFromFavourites(
          request.user.walletAddress,
          userFavouritesDto.itemId,
        );
        return this.responseModel.response(
          result,
          ResponseStatusCode.OK,
          true,
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
   * @description: getFavouriteItems returns the items present in current user favourites
   * @returns: Items
   * @author Jeetanshu Srivastava
   */
  @Get('/getFavouriteItems')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Nft Item')
  @ApiOperation({
    summary: 'Returns Current User Watchlist Items',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.ITEMS_LIST,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async getFavouriteItems(
    @Response() response,
    @Request() request,
  ): Promise<any> {
    try {
      const items = await this.nftItemService.getItemForUserFavourites(
        request.user.walletAddress,
      );
      return this.responseModel.response(
        items,
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

  @ApiTags('Nft Item')
  @Get('/getNftItemByID/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'GET ITEM DATA BY ITEM ID' })
  async fatchNftItemByID(@Param('id') id: string) {
    try {
      return await this.nftItemService.findOne(id);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @ApiTags('Nft Item')
  @Put('/updateViewer/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Update VIEWER COUNT on a  ITEM' })
  async updateViewerCount(@Param('id') id: string) {
    try {
      return await this.nftItemService.updateViewerCount(id);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  /**
   * @description: This api fetch all the item of a collection except one
   * @param id
   * @returns: all Item from a collection except one
   * @author: vipin
   */
  @ApiTags('Nft Item')
  @ApiOperation({
    summary: 'it will fetch nft item from a collection except one',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: 'Nft Fetch all from a collection',
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.ITEM_NOT_FOUND,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @Get('fetchFromCollection/:id')
  async findAllItemExceptOne(
    @Param('id') id: string,
    @Response() response,
  ): Promise<any> {
    try {
      const find = await this.nftItemService.findAllItemExceptOne(id);
      return this.responseModel.response(
        find,
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
   * @description: This api delete an item
   * @param id
   * @returns: status and message
   * @author: vipin
   */
  @ApiTags('Nft Item')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'it will delete nft item' })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.ITEM_DELETED,
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.ITEM_NOT_FOUND,
  })
  @ApiResponse({
    status: ResponseStatusCode.BAD_REQUEST,
    description: ResponseMessage.USER_DOES_NOT_OWN_ITEM,
  })
  @ApiResponse({
    status: ResponseStatusCode.BAD_REQUEST,
    description: ResponseMessage.ITEM_IS_FREEZED,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  @Delete('delete/:id')
  async deleteItem(
    @Param('id') id: string,
    @Request() req,
    @Response() response,
  ): Promise<any> {
    try {
      const item = await this.nftItemService.findOne(id);
      if (item.isFreezed === true) {
        return this.responseModel.response(
          ResponseMessage.ITEM_IS_FREEZED,
          ResponseStatusCode.BAD_REQUEST,
          false,
          response,
        );
      }
      if (!item)
        return this.responseModel.response(
          ResponseMessage.ITEM_NOT_FOUND,
          ResponseStatusCode.NOT_FOUND,
          false,
          response,
        );
      if (req.user.walletAddress === item.owner) {
        const data = await this.nftItemService.deleteItem(id);
        return this.responseModel.response(
          data,
          ResponseStatusCode.OK,
          true,
          response,
        );
      } else {
        return this.responseModel.response(
          ResponseMessage.USER_DOES_NOT_OWN_ITEM,
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
   * @description: This api transfer a item to other user
   * @param id
   * @returns: status and message
   * @author: vipin
   */
  @ApiTags('Nft Item')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'it will transfer nft item' })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.ITEM_TRANSFERED,
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.ITEM_NOT_FOUND,
  })
  @ApiResponse({
    status: ResponseStatusCode.BAD_REQUEST,
    description: ResponseMessage.USER_DOES_NOT_OWN_ITEM,
  })
  @ApiResponse({
    status: ResponseStatusCode.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST_TRANSFER,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  @Patch('transfer/:id')
  async transferItem(
    @Param('id') id: string,
    @Request() req,
    @Body() transferDto: TransferItemDto,
    @Response() response,
  ): Promise<any> {
    try {
      const item = await this.nftItemService.findOne(id);
      if (!item)
        return this.responseModel.response(
          ResponseMessage.ITEM_NOT_FOUND,
          ResponseStatusCode.NOT_FOUND,
          false,
          response,
        );
      if (req.user.walletAddress === transferDto.userWalletAddress) {
        return this.responseModel.response(
          ResponseMessage.BAD_REQUEST_TRANSFER,
          ResponseStatusCode.BAD_REQUEST,
          false,
          response,
        );
      }
      if (req.user.walletAddress === item.owner) {
        const data = await this.nftItemService.transferItem(
          id,
          transferDto,
          item,
        );
        return this.responseModel.response(
          data,
          ResponseStatusCode.OK,
          true,
          response,
        );
      } else {
        return this.responseModel.response(
          ResponseMessage.USER_DOES_NOT_OWN_ITEM,
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
   * @description gey all items with filters. Open  Api
   * @param filterDtoAllItems
   * @returns array of items based on filters
   * @author Mohan
   */
  @ApiTags('Nft Item')
  @ApiOperation({ summary: 'it will fetch nft items according to filters' })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: 'Nft Fetch all from a collection',
  })
  @Get('allItems')
  async getAllItems(
    @Query() filterDtoAllItems: FilterDtoAllItems,
  ): Promise<any> {
    return this.nftItemService.getAllItems(filterDtoAllItems);
  }

 /**
   * @description: This api updates the cashback an item
   * @param UpdateNftItemDto
   * @returns: Update cashback
   * @author: susmita
   */
  @ApiTags('Nft Item')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
   @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.TOKEN_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @Put('/updatecashback')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'UPDATE CASHBACK ON AN ITEM' })
  async updateCashback(@Request() request,@Body() updateCashbackDto: UpdateCashbackDto,) {
    try {
      await this.authService.checkAdmin(request.user.data);
      return await this.nftItemService.updateCashback(updateCashbackDto);
    } catch (e) {
      throw new BadRequestException(e.message);
     }
  }

}
