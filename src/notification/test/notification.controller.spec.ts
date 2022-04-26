import { Test } from '@nestjs/testing';
// import { ResponseHandlerService } from '../../helpers/response.handler.service';
import { NotificationController } from '../notification.controller';
import { NotificationService } from '../notification.service';

jest.mock('../notification.service');

describe('UsersController', () => {
    let notificationController: NotificationController
    let notificationService: NotificationService

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [NotificationController],
            providers: [NotificationService]
        }).compile();
        
        notificationController = moduleRef.get<NotificationController>(NotificationController);
        notificationService = moduleRef.get<NotificationService>(NotificationService);
        jest.clearAllMocks();
    });

    describe('update', () => {
        describe('when update is called', () => {
          let result;
          beforeEach(async () => {
            result = await notificationController.update('1', {});
          });
          test('it should call notificationService', () => {
            expect(notificationService.updateNotification).toBeCalledWith('1', {});
          });
          test('then it should return an object', () => {
            expect(result).toEqual({success: true});
          });
        });
    });

    describe('getNotification', () => {
        describe('when getNotification is called', () => {
          let result;
          beforeEach(async () => {
            result = await notificationController.getNotification('1');
          });
          test('it should call notificationService', () => {
            expect(notificationService.getNotification).toBeCalledWith('1');
          });
          test('then it should return an object', () => {
            expect(result).toEqual({success: true});
          });
        });
    });
})