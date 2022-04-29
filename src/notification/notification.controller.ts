import {
  Get,
  Controller,
  UseGuards,
  Body,
  Patch,
  Response,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseStatusCode } from '../../shared/ResponseStatusCode';
import { NotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';
import { ResponseMessage } from '../../shared/ResponseMessage';
import { GetUser } from './decorator/decorator';
import { User } from '../user/entities/user.entity';
import { ResponseModel } from 'src/responseModel';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly responseModel: ResponseModel,
  ) {}

  /**
   * @description update will update notification settings of login user
   * @param User
   * @param notificationDto
   * @returns it will return updated notifiction settings
   * @author Vipin
   */
  @UseGuards(JwtAuthGuard)
  @ApiTags('Notification Module')
  @ApiOperation({ summary: 'update user notification settings' })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.NOTIFICATION_SETTING_UPDATED,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  @Patch('me')
  async update(
    @GetUser() user: User,
    @Body() notificationDto: NotificationDto,
    @Response() response,
  ): Promise<any> {
    try {
      await this.notificationService.updateNotification(user, notificationDto);
      return this.responseModel.response(
        ResponseMessage.NOTIFICATION_SETTING_UPDATED,
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
   * @description it will show notifiction settings of login user
   * @param user
   * @returns it will return notification settings
   * @author Vipin
   */
  @UseGuards(JwtAuthGuard)
  @ApiTags('Notification Module')
  @ApiOperation({ summary: 'get all notification settings of login user' })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.GET_NOTIFICATION,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  @Get('me')
  async getNotification(
    @GetUser() user: User,
    @Response() response,
  ): Promise<any> {
    try {
      const data = await this.notificationService.getNotification(user);
      return this.responseModel.response(
        data,
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
