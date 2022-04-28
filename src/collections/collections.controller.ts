import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { response } from 'express';
import { ResponseMessage } from 'shared/ResponseMessage';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { ResponseModel } from 'src/responseModel';
import { CollectionsService } from './collections.service';
import { CreateCollectionsDto } from './dto/create-collections.dto';
import { UpdateCollectionsDto } from './dto/update-collection.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilterDto } from './dto/filter.dto';

@Controller('collections')
export class CollectionsController {
  constructor(
    private readonly collectionService: CollectionsService,
    private readonly responseModel: ResponseModel,
  ) {}

  /**
   * @description: 'This api creates new collection'
   * @param createCollectionDto
   * @returns: Created Collection
   * @author: Ansh Arora
   */
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Collection Module')
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
  async create(@Body() createCollectionDto: CreateCollectionsDto) {
    try {
      const collection = await this.collectionService.create(
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
  @UseGuards(JwtAuthGuard)
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
  async findAll(@Query() filterDto: FilterDto, @Request() req) {
    try {
      const owner = req.user;
      filterDto.take = filterDto.take > 20 ? 20 : filterDto.take;
      if (!filterDto.skip) {
        filterDto.skip === 0;
      }
      const collections = await this.collectionService.findAll(
        filterDto,
        owner,
      );
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
   * @description: This api finds single collection using id
   * @param id
   * @returns: Single collection that matches the id
   * @author: Ansh Arora
   */
  @Get(':id')
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
  async findOne(@Param('id') id: string, @Request() req) {
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
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Collection Module')
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
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionsDto,
  ) {
    try {
      const collection = await this.collectionService.findOne(id, req.user.id);
      if (req.user.id === collection.owner) {
        const updatedCollection = await this.collectionService.update(
          id,
          updateCollectionDto,
        );
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
   * @returns: Update Staus
   * @author: Ansh Arora
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Collection Module')
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
  async delete(@Request() req, @Param('id') id: string) {
    try {
      const owner = req.user.id;
      const collection = await this.collectionService.findOne(id, owner);
      if (req.user.id === collection.owner) {
        if (collection) {
          collection.isDeleted = true;
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
}
