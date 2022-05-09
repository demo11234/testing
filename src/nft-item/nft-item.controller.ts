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
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
   * @param NftItemDto
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
      const activity = await this.activityService.createActivity({
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
   * @description: This api find item and returns status
   * @param filterDto
   * @returns: find Item
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
  async findNftItems(
    @Query() filterDto: FilterDto,
    @Response() response,
  ): Promise<any> {
    try {
      const find = await this.nftItemService.findNftItems(filterDto);
      if (find) {
        return this.responseModel.response(
          find,
          ResponseStatusCode.OK,
          true,
          response,
        );
      } else {
        return this.responseModel.response(
          ResponseMessage.ITEM_NOT_FOUND,
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
   * @description: This api updates the item and returns status
   * @param id
   * @param UpdateNftItemDto
   * @returns: Update Item
   * @author: vipin
   */
  @ApiTags('Nft Item')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'It will update item' })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: 'Nft Fetch',
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
}
