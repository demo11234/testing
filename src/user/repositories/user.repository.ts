import { EntityRepository, Repository, getConnection } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserInterface } from '../interface/user.interface';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  /**
   * @description createUser will create User if user with given wallet address
   * @param UserInterface
   * @returns it will return created user details
   * @author Jeetanshu Srivastava
   */
  async createUser(userInterface: UserInterface): Promise<User> {
    const { walletAddress } = userInterface;
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
   * @description createUser will find user with given wallet address
   * @param walletAddress
   * @returns it will return user details
   * @author Jeetanshu Srivastava
   */
  async findUser(walletAddress: string): Promise<User> {
    try {
      const user = await this.findOne({
        where: { 
          walletAddress : walletAddress
        }
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
    async updateUserDetails(userInterface: UserInterface): Promise<any> {
    try {
      const { walletAddress } = userInterface;
      
      const user = await this.findOne({ 
        where : { walletAddress }
      });

      if(!user) return null;

      const keys = Object.keys(userInterface)
      keys.forEach((key) => {
        user[key] = userInterface[key];
      });

      return await this.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

}
