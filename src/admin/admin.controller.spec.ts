import { Test } from '@nestjs/testing';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import {
  adminReturnStub,
  createAdminStub,
  loginAdminReturnStub,
  loginAdminStub,
  updateAdminReturnStub,
} from './test/stubs/admin.stub';

jest.mock('./admin.service');

describe('AdminController', () => {
  let adminController: AdminController;
  let adminService: AdminService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [AdminController],
      providers: [AdminService],
    }).compile();
    adminController = moduleRef.get<AdminController>(AdminController);

    adminService = moduleRef.get<AdminService>(AdminService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let result;
      beforeEach(async () => {
        result = await adminController.create(createAdminStub());
      });
      test('it should call adminService', () => {
        expect(adminService.create).toBeCalledWith(createAdminStub());
      });
      test('then it should return an object', () => {
        expect(result).toEqual(adminReturnStub());
      });
    });
  });

  describe('when login is called', () => {
    let result;
    beforeEach(async () => {
      result = await adminController.login(loginAdminStub());
    });
    test('it should call adminService', () => {
      expect(adminService.login).not.toBeCalledWith(loginAdminStub());
    });
    test('then it should return an object', () => {
      expect(result).toEqual(loginAdminReturnStub());
    });
  });

  describe('when update is called', () => {
    let result;
    beforeEach(async () => {
      result = await adminController.update('1', {
        username: 'mohan1@mohan.com',
      });
    });
    test('it should call adminService', () => {
      expect(adminService.updateAdmin).toBeCalledWith('1', {
        username: 'mohan1@mohan.com',
      });
    });
    test('then it should return an object', () => {
      expect(result).toEqual(updateAdminReturnStub());
    });
  });
});
