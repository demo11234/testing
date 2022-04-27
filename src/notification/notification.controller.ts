import { Get, Controller, UseGuards, Body, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseStatusCode } from '../../shared/ResponseStatusCode';
import { NotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';
import { ResponseMessage } from '../../shared/ResponseMessage';
import { GetUser } from './decorator/decorator';
import { User } from '../user/entities/user.entity';

@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
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
    @ApiOperation({summary:'update user notification settings' })
    @ApiResponse({
        status: ResponseStatusCode.OK,
        description: 'notification settings is updated',
    })
    @ApiResponse({
        status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
        description: ResponseMessage.INTERNAL_SERVER_ERROR,
    })
    @ApiBearerAuth()
    @Patch('me')
    async update(@GetUser() user: User, @Body() notificationDto: NotificationDto): Promise<any> {
        let data = await this.notificationService.updateNotification(user, notificationDto);
        return data;
    }

    /**
   * @description it will show notifiction settings of login user
   * @param user
   * @returns it will return notification settings
   * @author Vipin
   */
    @UseGuards(JwtAuthGuard)
    @ApiTags('Notification Module')
    @ApiOperation({summary:'get all notification settings of login user',})
    @ApiResponse({
        status: ResponseStatusCode.OK,
        description: 'Returns all notification settings of user',
    })
    @ApiResponse({
        status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
        description: ResponseMessage.INTERNAL_SERVER_ERROR,
    })
    @ApiBearerAuth()
    @Get('me')
    async getNotification(@GetUser() user: User): Promise<any> {
        return await this.notificationService.getNotification(user);
    }
}
