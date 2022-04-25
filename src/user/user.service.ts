import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { Cache } from 'cache-manager';
import { WalletAddressDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository, //  @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * @description createUser will create User if user with given wallet address
   * @param createUserDto
   * @returns it will return user details
   * @author Jeetanshu Srivastava
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.createUser(createUserDto);
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
  async findUser(walletAddressDto: WalletAddressDto): Promise<any> {
    try {
      const { walletAddress } = walletAddressDto;

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
      let user = await this.userRepository.updateUserDetails(
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
}
