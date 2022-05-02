import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'shared/ResponseMessage';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseModel } from 'src/responseModel';
import { ActivityService } from './activity.service';
import { ActivityFilterDto } from './dto/activity-filter.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly responseModel: ResponseModel,
  ) {}

  /**
   * @description: 'This api creates new activity'
   * @param createActivityDto
   * @returns: Created Activity
   * @author: Ansh Arora
   */
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Activity Module')
  @ApiOperation({
    summary: 'Creates a new activity on a collection',
  })
  @ApiResponse({
    status: ResponseStatusCode.CREATED,
    description: ResponseMessage.ACTIVITY_CREATED,
  })
  @ApiResponse({
    status: ResponseStatusCode.CONFLICT,
    description: ResponseMessage.ACTIVITY_CREATION_FAILED,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @Response() response,
  ) {
    try {
      const activity = await this.activityService.createActivity(
        createActivityDto,
      );
      if (activity) {
        return this.responseModel.response(
          activity,
          ResponseStatusCode.CREATED,
          true,
          response,
        );
      } else {
        return this.responseModel.response(
          ResponseMessage.ACTIVITY_CREATION_FAILED,
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
   * @description: This api returns all activities of a collection
   * @returns: All activities of a collection
   * @author: Ansh Arora
   */
  @Get()
  @ApiTags('Activity Module')
  @ApiOperation({
    summary: 'Find All Activities of a collection',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: 'Returns All activities of a collection',
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.ACTIVITIES_DO_NOT_EXIST,
  })
  async findAll(@Query() filterDto: ActivityFilterDto, @Response() response) {
    try {
      filterDto.take = filterDto.take <= 20 ? 20 : filterDto.take;
      if (!filterDto.skip) {
        filterDto.skip === 0;
      }
      const activites = await this.activityService.findAll(filterDto);
      if (activites) {
        return this.responseModel.response(
          activites,
          ResponseStatusCode.OK,
          true,
          response,
        );
      } else {
        return this.responseModel.response(
          ResponseMessage.ACTIVITIES_DO_NOT_EXIST,
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
   * @description: This api finds single activity using id
   * @param id
   * @returns: Single activity that matches the id
   * @author: Ansh Arora
   */
  @Get(':id')
  @ApiTags('Activity Module')
  @ApiOperation({
    summary: 'Find one activity',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: 'Single Activity',
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.COLLECTION_DOES_NOT_EXIST,
  })
  async findOne(@Param('id') id: string, @Response() response) {
    try {
      const activity = await this.activityService.findOne(id);
      if (activity) {
        return this.responseModel.response(
          activity,
          ResponseStatusCode.OK,
          true,
          response,
        );
      } else {
        return this.responseModel.response(
          ResponseMessage.ACTIVITY_DOES_NOT_EXIST,
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
   * @description: This api updates the activity and returns status
   * @param id
   * @param updateActivityDto
   * @returns: Update Staus
   * @author: Ansh Arora
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Activity Module')
  @ApiOperation({
    summary: 'Update Activity Details',
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.COLLECTION_DOES_NOT_EXIST,
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: 'Activity Details',
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @Response() response,
  ) {
    try {
      const updatedActivity = await this.activityService.update(
        id,
        updateActivityDto,
      );
      if (updatedActivity) {
        return this.responseModel.response(
          updatedActivity,
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
   * @description: This api deletes activity
   * @param id
   * @returns: null
   * @author: Ansh Arora
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Activity Module')
  @ApiOperation({
    summary: 'Deletes the Activity',
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.ACTIVITY_DOES_NOT_EXIST,
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.COLLECTION_DELETED,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  async delete(@Param('id') id: string, @Response() response) {
    try {
      await this.activityService.delete(id);
      return this.responseModel.response(
        ResponseMessage.ACTIVITY_DELETED,
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
