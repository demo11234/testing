import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';
import { FileUpload } from './utils/s3.upload';

jest.mock('./user.service');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let fileUpload: FileUpload;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        FileUpload
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    fileUpload = module.get<FileUpload>(FileUpload);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
