import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserInterface } from '../interface/update-user.interface';
import { CreateUserInterface } from '../interface/create-user.interface';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  /**
   * @description createUser will create User if user with given wallet address
   * @param UserInterface
   * @returns it will return created user details
   * @author Jeetanshu Srivastava
   */
  async createUser(createUserInterface: CreateUserInterface): Promise<User> {
    const { walletAddress } = createUserInterface;
    try {
      let user = new User();
      user.walletAddress = walletAddress;
      user = await this.save(user);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description findUser will find user with given wallet address
   * @param walletAddress
   * @returns it will return user details
   * @author Jeetanshu Srivastava
   */
  async findUser(walletAddress: string): Promise<User> {
    try {
      const user = await this.findOne({
        where: { walletAddress }
      });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description findUserByUserNamw will find user with given user name
   * @param userName
   * @returns it will return user details
   * @author Jeetanshu Srivastava
   */
  async findUserByUserName(userName: string): Promise<User> {
    try {
      const user = await this.findOne({
        where: { userName }
      });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description findUserByEmail will find user with given email
   * @param email
   * @returns it will return user details
   * @author Jeetanshu Srivastava
   */
  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.findOne({
        where: { email }
      });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description updateUserDetails will update the user details with given wallet address
   * @param UserInterface
   * @returns it will return user details
   * @author Jeetanshu Srivastava
   */
    async updateUserDetails(walletAddress: string, updateUserInterface: UpdateUserInterface): Promise<any> {
    try {

      const user = await this.findOne({ 
        where : { walletAddress }
      });

      if(!user) return null;

      const keys = Object.keys(updateUserInterface)
      keys.forEach((key) => {
        user[key] = updateUserInterface[key];
      });

      return await this.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

}