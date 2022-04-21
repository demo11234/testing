import {
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {

  constructor(
    private readonly userRepository: UserRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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
   * @description createUser will return user details with given wallet address or null if there is no user with given wallet address
   * @param walletAddress
   * @returns it will return user details or null
   * @author Jeetanshu Srivastava
   */
  async findUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      const { walletAddress } = createUserDto;

      const cachedItem = await this.cacheManager.get(walletAddress);
      if(cachedItem) return cachedItem;

      const user = await this.userRepository.findUser(walletAddress);
      if (!user) return null;

      await this.cacheManager.set(walletAddress, user);
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
  async update(updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const { walletAddress } = updateUserDto;

      let user = await this.userRepository.updateUserDetails(updateUserDto);
      if (!user) return null;

      await this.cacheManager.set(walletAddress, user);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}
