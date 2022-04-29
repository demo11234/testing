import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../src/user/repositories/user.repository';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let jwtModule: JwtModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserRepository,
        JwtModule,
        {
          provide: JwtService,
          useValue: {
              sign: jest.fn().mockReturnValue('abcdefgh'),
              // verify: jest.fn().mockResolvedValue({ otp: 123 }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
    jwtModule = module.get<JwtModule>(JwtModule);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
