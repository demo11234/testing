import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  Param,
  Patch,
  Put,
  UseGuards,
  Query,
  ValidationPipe,
  UsePipes,
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

@Controller('nft-item')
@UsePipes(ValidationPipe)
export class NftItemController {
  constructor(
    private readonly nftItemService: NftItemService,
    private readonly responseModel: ResponseModel,
    private readonly activityService: ActivityService,
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
        fromAccount: null,
        toAccount: req.user.walletAddress,
        totalPrice: null,
        isPrivate: false,
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
      if (!item)
        return this.responseModel.response(
          ResponseMessage.ITEM_NOT_FOUND,
          ResponseStatusCode.NOT_FOUND,
          false,
          response,
        );
      if (req.user.walletAddress === item.walletAddress) {
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
   * @description gey all items with filters. Open  Api
   * @param filterDtoAllItems
   * @returns
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
}
