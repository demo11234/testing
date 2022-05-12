import { Test } from '@nestjs/testing';
// import { response } from 'express';
// import { ResponseMessage } from '../../../shared/ResponseMessage';
// import { ResponseStatusCode } from '../../../shared/ResponseStatusCode';
import { ResponseModel } from '../../responseModel';
import { NotificationController } from '../notification.controller';
import { NotificationService } from '../notification.service';
import { notificationStub, userStub } from './stub/notification.stub';

jest.mock('../notification.service');

describe('AdminController', () => {
  let notificationController: NotificationController
  let notificationService: NotificationService
  let responseModel: ResponseModel
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [NotificationController],
      providers: [NotificationService,
        {
          provide: ResponseModel,
          useValue: {message: 'any', status: 200, success: true}
        },
      ],
    }).compile();
    notificationController = moduleRef.get<NotificationController>(NotificationController);
    responseModel = moduleRef.get<ResponseModel>(ResponseModel);
    notificationService = moduleRef.get<NotificationService>(NotificationService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(notificationController).toBeDefined();
  });

    describe('update', () => {
        describe('when update is called', () => {
          let result;
          beforeEach(async () => {
            // responseModel.response.mockResolvedValue(null);
          
            result = await notificationController.update(userStub(), notificationStub(), {status:200});
          });
          test('it should call notificationService', () => {
            expect(notificationService.updateNotification).toBeCalledWith(userStub(), notificationStub());
          });
          test('then it should return an object', () => {
            expect(result).toEqual({success: true});
          });
        });
    });

    // describe('getNotification', () => {
    //     describe('when getNotification is called', () => {
    //       let result;
    //       beforeEach(async () => {
    //         result = await notificationController.getNotification(userStub(), response);
    //       });
    //       test('it should call notificationService', () => {
    //         expect(notificationService.getNotification).toBeCalledWith(userStub());
    //       });
    //       test('then it should return an object', () => {
    //         expect(result).toEqual({success: true});
    //       });
    //     });
    // });
})