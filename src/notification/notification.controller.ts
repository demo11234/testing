import { Get, Post } from '@nestjs/common';
import { Body, Param, Patch } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseStatusCode } from '../../shared/ResponseStatusCode';
import { NotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
    ) {}

    /**
   * @description update will update motification 
   * @param notificationDto
   * @param walletAddress
   * @returns it will return updated notifiction
   * @author Vipin
   */
    @ApiTags('Notification Module')
    @ApiOperation({summary:'update notification settings' })
    @ApiResponse({
        status: ResponseStatusCode.OK,
        description: 'notification settings is updated',
    })
    @Patch()
    async update(@Param('walletAddress') walletAddress: string, @Body() notificationDto: NotificationDto): Promise<any> {
        let data = await this.notificationService.updateNotification(walletAddress, notificationDto);
        return data;
    }

    /**
   * @description it will show notifiction of user
   * @param walletAddress
   * @returns it will return notification of user
   * @author Vipin
   */
    @ApiTags('Notification Module')
    @ApiOperation({summary:'get all notification settings',})
    @ApiResponse({
        status: ResponseStatusCode.OK,
        description: 'Returns all notification settings',
    })
    @Get()
    async getNotification(@Param('walletAddress') walletAddress: string): Promise<any> {
        let data = await this.notificationService.getNotification(walletAddress);
        return data;
    }
}
