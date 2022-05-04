import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { Cache } from 'cache-manager';
import { WalletAddressDto } from './dto/get-user.dto';
import { FileUpload } from './utils/s3.upload';
import { NotificationService } from '../notification/notification.service';
import { Category } from 'src/admin/entities/categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignedUrlDto } from './dto/signed-url.dto';
import 'dotenv/config';
import { ServicesService } from 'src/services/services.service';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationService,
    private readonly servicesService: ServicesService,
    //private readonly nftItemService : NftItemService ,
    private readonly fileUpload: FileUpload, //  @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async onModuleInit() {
    try {
      const nftAccount = await this.userRepository.findOne({
        walletAddress: process.env.MINTING_ACCOUNT_ADDRESS,
      });
      if (nftAccount) {
        throw new Error('Already exists');
      }
      const user = new User();
      user.userName = process.env.MINTING_ACCOUNT_USERNAME;
      user.walletAddress = process.env.MINTING_ACCOUNT_ADDRESS;
      await this.userRepository.save(user);
    } catch (error) {
      console.error(error.message);
      // throw new Error(error);
    }
  }

  /**
   * @description createUser will create User if user with given wallet address
   * @param createUserDto
   * @returns it will return user details
   * @author Jeetanshu Srivastava
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.createUser(createUserDto);
      await this.notificationService.createNotification(createUserDto, user);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description findUser will return user details with given wallet address or null if there is no user with given wallet address
   * @param CreateUserDto
   * @returns it will return user details or null
   * @author Jeetanshu Srivastava
   */
  async findUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      //Fetching user info from cache
      // const cachedItem = await this.cacheManager.get(walletAddress);
      // if (cachedItem) return cachedItem;

      const user = await this.userRepository.findUser(
        createUserDto.walletAddress,
      );
      if (!user) return null;

      //Setting user info into the cache
      // await this.cacheManager.set(walletAddress, user);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description findUserByWalletAddress will return user details with given wallet address or null if there is no user with given wallet address
   * @param walletAddress
   * @returns it will return user details or null
   * @author Jeetanshu Srivastava
   */
  async findUserByWalletAddress(walletAddress: string): Promise<any> {
    try {
      //Fetching user info from cache
      // const cachedItem = await this.cacheManager.get(walletAddress);
      // if (cachedItem) return cachedItem;

      const user = await this.userRepository.findUser(walletAddress);
      if (!user) return null;

      //Setting user info into the cache
      // await this.cacheManager.set(walletAddress, user);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description findUserByUserName will return user details with given user name
   * @param userName
   * @returns it will return user details or null
   * @author Jeetanshu Srivastava
   */
  async findUserByUserName(userName: string): Promise<any> {
    try {
      //Fetching user info from cache
      // const cachedItem = await this.cacheManager.get(userName);
      // if (cachedItem) return cachedItem;

      const user = await this.userRepository.findUserByUserName(userName);
      if (!user) return null;

      //Setting user info into the cache
      // await this.cacheManager.set(userName, user);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description findUserByEmail will return user details with given email
   * @param email
   * @returns it will return user details or null
   * @author Jeetanshu Srivastava
   */
  async findUserByEmail(email: string): Promise<any> {
    try {
      //Fetching user info from cache
      // const cachedItem = await this.cacheManager.get(email);
      // if (cachedItem) return cachedItem;

      const user = await this.userRepository.findUserByEmail(email);
      if (!user) return null;

      //Setting user info into the cache
      // await this.cacheManager.set(email, user);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description update will update the user details
   * @param UpdateUserDto
   * @returns it will return user details
   * @author Jeetanshu Srivastava
   */
  async update(
    walletAddress: string,
    updateUserDto: UpdateUserDto,
  ): Promise<any> {
    try {
      const user = await this.userRepository.updateUserDetails(
        walletAddress,
        updateUserDto,
      );
      if (!user) return null;

      //Setting user info into the cache
      // await this.cacheManager.set(walletAddress, user);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description it will genrate preSinged url for s3 bucket
   * @param signedUrlDto
   * @returns it will return preSigned url
   * @author Vipin
   */
  async getPresignedURL(signedUrlDto: SignedUrlDto): Promise<any> {
    try {
      const { fileName, fileType, filePath } = signedUrlDto;
      const url = await this.fileUpload.signedUrl(fileName, fileType, filePath);
      return url;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * @description gets all categories
   * @returns All categories
   */
  async findAllCategories(): Promise<Category[]> {
    try {
      return this.categoryRepository.find({
        where: {
          categoryStatus: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
