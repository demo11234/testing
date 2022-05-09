import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Response,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'shared/ResponseMessage';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { ResponseModel } from 'src/responseModel';
import { ActivityService } from './activity.service';
import { ActivityFilterDto } from './dto/activity-filter.dto';

@Controller('activity')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly responseModel: ResponseModel,
  ) {}

  /**
   * @description: This api returns all activities of a collection
   * @returns: All activities of a collection
   * @author: Ansh Arora
   */
  @Post()
  @ApiTags('Activity Module')
  @ApiOperation({
    summary: 'Find All Activities of a collection',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.ACTIVITIES,
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.ACTIVITIES_DO_NOT_EXIST,
  })
  async findAll(
    @Query() activityFilterDto: ActivityFilterDto,
    @Response() response,
  ) {
    try {
      const activity = await this.activityService.getActivity(
        activityFilterDto,
      );
      return this.responseModel.response(
        activity,
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
   * @description: findAtivityByItemId returns activty for a particular item
   * @param id
   * @returns: Activities of given id
   * @author: Jeetanshu Srivastava
   */
  @Get(':id')
  @ApiTags('Activity Module')
  @ApiOperation({
    summary: 'Find activity for a partiular item',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.ITEM_ACTIVITIES,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  async findActivityByItemId(@Param('id') id: string, @Response() response) {
    try {
      const activity = await this.activityService.getActivityByItemId(id);
      return this.responseModel.response(
        activity,
        ResponseStatusCode.NOT_FOUND,
        false,
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
