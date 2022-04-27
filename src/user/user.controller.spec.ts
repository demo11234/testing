import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { ResponseModel } from '../responseModel';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

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
})