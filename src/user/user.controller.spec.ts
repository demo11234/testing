import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { ResponseModel } from '../responseModel';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { s3Folder } from '../user/enum/s3-filepath.enum';
import { Request, Response } from '@nestjs/common';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { createUserReturnStub, createUserStub, getPresignedURLReturnStub, getPresignedURLStub, getUserByWalletAddressReturnStub, getUserDetailsByUseNameServiceStub, getUserDetailsByUserNameReturnStub, getUserDetailsByUserNameStub, getUserDetailsByWalletAddressStub } from './test/stubs/user.stub';

jest.mock('./user.service');

describe('UserController', () => {
  let userController: UserController
  let userService: UserService
  let authService: AuthService
  let jwtService: JwtService
  let userRepository: UserRepository
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [UserService,
        ResponseModel,
        AuthService,
        {
          provide: JwtService,
          useValue: {
              sign: jest.fn().mockReturnValue('abcdefgh'),
              verify: jest.fn().mockResolvedValue({ otp: 123 }),
          }
        },
        UserRepository
      ],
    }).compile();
    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('createUser', () => {
    describe('when createUser is called', () => {
      let result;
      beforeEach(async () => {
        result = await userController.createUser(createUserStub(), Response());
      });
      test('it should call findUser', () => {
        expect(userService.findUser).toBeCalledWith(createUserStub());
      });
      test('then it should return an object', () => {
        expect(result).toEqual(createUserReturnStub());
      });
    });
  });

  describe('getUserDetailsByUserName', () => {
    describe('when get user by user name is called', () => {
      let result;
      beforeEach(async () => {
        result = await userController.getUserDetailsByUserName(getUserDetailsByUserNameStub(), Response());
      });
      test('it should call findUserByUserName', () => {
        expect(userService.findUserByUserName).toBeCalledWith(getUserDetailsByUseNameServiceStub());
      });
      test('then it should return an object', () => {
        expect(result).toEqual(getUserDetailsByUserNameReturnStub());
      });
    });
  });

  describe('getuseretailsbywalletaddress', () => {
    describe('when get user by wallet address is called', () => {
      let result;
      beforeEach(async () => {
        result = await userController.getUserDetailsByWalletAddress(getUserDetailsByWalletAddressStub(), Response());
      });
      test('it should call findUser', () => {
        expect(userService.findUser).toBeCalledWith(getUserDetailsByWalletAddressStub());
      });
      test('then it should return an object', () => {
        expect(result).toEqual(getUserByWalletAddressReturnStub());
      });
    });
  });

  describe('getPresignedURL', () => {
    describe('when get Presigned URL is called', () => {
      let result;
      beforeEach(async () => {
        result = await userController.getPresignedURL(getPresignedURLStub());
        console.log(result);
      });
      test('it should call getPresignedURL', () => {
        expect(userService.getPresignedURL).toBeCalledWith(getPresignedURLStub());
      });
      test('then it should return an object', () => {
        expect(result).toEqual(getPresignedURLReturnStub());
      });
    });
  });
});