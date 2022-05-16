import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  Response,
  Put,
  Request,
  Delete,
} from '@nestjs/common';
import { ResponseMessage } from 'shared/ResponseMessage';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { ResponseModel } from 'src/responseModel';
import { CollectionsService } from './collections.service';
import { CreateCollectionsDto } from './dto/create-collections.dto';
import { UpdateCollectionsDto } from './dto/update-collection.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilterDto } from './dto/filter.dto';
import { UserWatchlistDto } from './dto/user-watchlist.dto';
import { UserService } from 'src/user/user.service';
import { UniqueCollectionCheck } from './dto/unique-collection-check.dto';

@Controller('collections')
export class CollectionsController {
  constructor(
    private readonly collectionService: CollectionsService,
    private readonly userService: UserService,
    private readonly responseModel: ResponseModel,
  ) {}

  /**
   * @description: 'This api creates new collection'
   * @param createCollectionDto
   * @returns: Created Collection
   * @author: Ansh Arora
   */
  @Post('create')
  @ApiTags('Collection Module')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Creates a new Collection owned by user who is logged in',
  })
  @ApiResponse({
    status: ResponseStatusCode.CREATED,
    description: ResponseMessage.COLLECTION_CREATED,
  })
  @ApiResponse({
    status: ResponseStatusCode.CONFLICT,
    description: ResponseMessage.COLLECTION_CREATION_FAILED,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async create(
    @Body() createCollectionDto: CreateCollectionsDto,
    @Req() req,
    @Response() response,
  ): Promise<any> {
    try {
      const owner = await this.userService.findUserByWalletAddress(
        req.user.walletAddress,
      );
      const collection = await this.collectionService.create(
        owner,
        createCollectionDto,
      );
      if (collection) {
        return this.responseModel.response(
          collection,
          ResponseStatusCode.CREATED,
          true,
          response,
        );
      } else {
        return this.responseModel.response(
          ResponseMessage.COLLECTION_CREATION_FAILED,
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
   * @description: This apis returns all collections
   * @returns: All collections
   * @author: Ansh Arora
   */
  @Get()
  @ApiTags('Collection Module')
  @ApiOperation({
    summary: 'Find All Collections',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: 'Returns All Collections',
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.COLLECTIONS_DO_NOT_EXIST,
  })
  async findAll(
    @Query() filterDto: FilterDto,
    @Response() response,
  ): Promise<any> {
    try {
      filterDto.take = filterDto.take <= 20 ? 20 : filterDto.take;
      if (!filterDto.skip) {
        filterDto.skip === 0;
      }
      const collections = await this.collectionService.findAll(filterDto);
      if (collections) {
        return this.responseModel.response(
          collections,
          ResponseStatusCode.OK,
          true,
          response,
        );
      } else {
        return this.responseModel.response(
          ResponseMessage.COLLECTIONS_DO_NOT_EXIST,
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
   * @description: This apis returns all collections by owner
   * @returns: All collections by owner
   * @author: Ansh Arora
   */
  @Get('/getByUserId/:id')
  @ApiTags('Collection Module')
  @ApiOperation({
    summary: 'Find All Collections by owner',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: 'Returns All Collections by owner',
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.COLLECTIONS_DO_NOT_EXIST,
  })
  async findAllByOwner(@Param('id') id: string, @Response() response) {
    try {
      const collections =
        await this.collectionService.findByOwnerOrCollaborator(id);
      return this.responseModel.response(
        collections,
        ResponseStatusCode.OK,
        true,
        response,
      );
    } catch (error) {
      console.log('error in controller', error);
      return this.responseModel.response(
        error,
        ResponseStatusCode.INTERNAL_SERVER_ERROR,
        false,
        response,
      );
    }
  }

  /**
   * @description: This api finds single collection using id
   * @param id
   * @returns: Single collection that matches the id
   * @author: Ansh Arora
   */
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Collection Module')
  @ApiOperation({
    summary: 'Find one collection',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: 'Single Collection',
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.COLLECTION_DOES_NOT_EXIST,
  })
  async findOne(
    @Param('id') id: string,
    @Req() req,
    @Response() response,
  ): Promise<any> {
    try {
      const owner = req.user;
      const collection = await this.collectionService.findOne(id, owner);
      if (collection) {
        return this.responseModel.response(
          collection,
          ResponseStatusCode.OK,
          true,
          response,
        );
      } else {
        return this.responseModel.response(
          ResponseMessage.COLLECTION_DOES_NOT_EXIST,
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
   * @description: This api updates the collection and returns status
   * @param id
   * @param updateCollectionDto
   * @returns: Update Staus
   * @author: Ansh Arora
   */
  @Patch('/update/:id')
  @ApiTags('Collection Module')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Update Collection Details owned by user who is currenlty Logged In',
  })
  @ApiResponse({
    status: ResponseStatusCode.CONFLICT,
    description: ResponseMessage.USER_DOES_NOT_OWN_COLLECTION,
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.COLLECTION_DOES_NOT_EXIST,
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: 'Collection Details',
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionsDto,
    @Response() response,
  ): Promise<any> {
    try {
      const owner = await this.userService.findUserByWalletAddress(
        req.user.walletAddress,
      );
      const collection = await this.collectionService.findOne(
        id,
        owner.walletAddress,
      );
      if (owner.walletAddress === collection.owner) {
        console.log('inside If id', id);
        const updatedCollection = await this.collectionService.update(
          id,
          updateCollectionDto,
        );
        console.log('updated', updateCollectionDto);
        if (updatedCollection) {
          return this.responseModel.response(
            updatedCollection,
            ResponseStatusCode.OK,
            true,
            response,
          );
        }
      } else {
        return this.responseModel.response(
          ResponseMessage.USER_DOES_NOT_OWN_COLLECTION,
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
   * @description: This api updates the collection and returns status
   * @param id
   * @param updateCollectionDto
   * @returns: Update Status
   * @author: Ansh Arora
   */
  @Delete(':id')
  @ApiTags('Collection Module')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Soft deletes the Collection owned by user who is currenlty Logged In',
  })
  @ApiResponse({
    status: ResponseStatusCode.CONFLICT,
    description: ResponseMessage.USER_DOES_NOT_OWN_COLLECTION,
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.COLLECTION_DOES_NOT_EXIST,
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.COLLECTION_DELETED,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  async delete(
    @Req() req,
    @Param('id') id: string,
    @Response() response,
  ): Promise<any> {
    try {
      const owner = req.user.id;
      const collection = await this.collectionService.findOne(id, owner);
      if (req.user.id === collection.owner) {
        if (collection) {
          await this.collectionService.delete(id);
          return this.responseModel.response(
            ResponseMessage.COLLECTION_DELETED,
            ResponseStatusCode.OK,
            true,
            response,
          );
        }
      } else {
        return this.responseModel.response(
          ResponseMessage.USER_DOES_NOT_OWN_COLLECTION,
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
   * @description: getWatchCollections returns the collections present in current user watchlist
   * @returns: Collections
   * @author: Jeetanshu Srivastava
   */
  @Put('/getWatchCollections')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Collection Module')
  @ApiOperation({
    summary: 'Returns Current User Watchlist Collection',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.COLLECTION_LIST,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async getWatchCollections(
    @Response() response,
    @Request() request,
  ): Promise<any> {
    try {
      const collections =
        await this.collectionService.getCollectionForUserWatchlist(
          request.user.walletAddress,
        );
      return this.responseModel.response(
        collections,
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
   * @description: watchlist adds or removes user from watchlist depending upon the value of isWatched
   * @param UserWatchlistDto
   * @returns: Updates Status
   * @author: Jeetanshu Srivastava
   */
  @Put('/watchlist')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Collection Module')
  @ApiOperation({
    summary:
      'Add and Removes user wallet address from watchlist of a collection',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.WATCHLIST_ADDED,
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.WATCHLIST_REMOVED,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async watchlist(
    @Body() userWatchlistDto: UserWatchlistDto,
    @Response() response,
    @Request() request,
  ): Promise<any> {
    try {
      const { isWatched } = userWatchlistDto;
      if (isWatched) {
        const result = await this.collectionService.addUserInWatchlist(
          request.user.walletAddress,
          userWatchlistDto.collectionId,
        );
        return this.responseModel.response(
          result,
          ResponseStatusCode.OK,
          true,
          response,
        );
      } else {
        const result = await this.collectionService.removeUseFromWatchlist(
          request.user.walletAddress,
          userWatchlistDto.collectionId,
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

  // /**
  //  * @description: This api adds or removes the collaborator
  //  * @param updateCollaboratorDto
  //  * @returns: Status on add or removal of collaborator
  //  * @author: Ansh Arora
  //  */
  // @Patch()
  // @UseGuards(JwtAuthGuard)
  // @ApiTags('Collection Module')
  // @ApiOperation({
  //   summary: 'Adds or removes the collaborator from the collection',
  // })
  // @ApiResponse({
  //   status: ResponseStatusCode.OK,
  //   description: ResponseMessage.COLLABORATOR_ADDED,
  // })
  // @ApiResponse({
  //   status: ResponseStatusCode.OK,
  //   description: ResponseMessage.COLLABORATOR_REMOVED,
  // })
  // @ApiResponse({
  //   status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
  //   description: ResponseMessage.INTERNAL_SERVER_ERROR,
  // })
  // async updateCollaborator(
  //   @Param() updateCollaboratorDto: UpdateCollaboratorDto,
  //   @Req() req,
  //   @Response() response,
  // ): Promise<any> {
  //   try {
  //     const owner = req.user;
  //     await this.collectionService.updateCollaborator(
  //       updateCollaboratorDto,
  //       owner,
  //     );
  //     if (updateCollaboratorDto.updateType === collaboratorUpdateType.ADD) {
  //       return this.responseModel.response(
  //         ResponseMessage.COLLABORATOR_ADDED,
  //         ResponseStatusCode.OK,
  //         true,
  //         response,
  //       );
  //     }
  //     return this.responseModel.response(
  //       ResponseMessage.COLLABORATOR_REMOVED,
  //       ResponseStatusCode.OK,
  //       true,
  //       response,
  //     );
  //   } catch (error) {
  //     return this.responseModel.response(
  //       error,
  //       ResponseStatusCode.INTERNAL_SERVER_ERROR,
  //       false,
  //       response,
  //     );
  //   }
  // }

  /**
   * @description checkUniqueCollection checks collection with unique name and url
   * @param UniqueCollectionCheck
   * @returns Boolean Values for collectionNameExists and collectionUrlExists
   * @author Jeetanshu Srivastava
   */
  @Put('/checkUniqueCollection')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Collection Module')
  @ApiOperation({
    summary: 'Boolean Values for Collection Name and Url',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.UNIQUE_COLLECTION_CHECK,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async checkUniqueCollection(
    @Query() uniquCollectionCheck: UniqueCollectionCheck,
    @Response() response,
  ): Promise<any> {
    try {
      const result = await this.collectionService.checkUniqueCollection(
        uniquCollectionCheck,
      );
      return this.responseModel.response(
        result,
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
