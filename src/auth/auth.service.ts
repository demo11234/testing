import { 
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { Constants } from 'shared/Constants';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository
    ) {}

    /**
     * @description createUserToken will create JWT Token for user
     * @param walletAddress
     * @param User
     * @returns it will return user details with JWT Token
     * @author Jeetanshu Srivastava
     */
    async createUserToken(walletAddress: string, user: User): Promise<any> {
        try {
            let bufferObj = Buffer.from(Constants.USER, "utf8");
            let base64String = bufferObj.toString("base64");        

            const payload = { 
                walletAddress,
                data : base64String
            };

            const newUserDetail = JSON.parse(JSON.stringify(user));
            const validity = Constants.USER_TOKEN_VALIDITY;

            const details = {
              ...newUserDetail,
              access_token: this.jwtService.sign(payload, {
                expiresIn: `${validity}`
              })
            };

            return details;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * @description checkUser will check the userType, it will return Boolean depending upon userType match
     * @param userType
     * @returns it will return false if userType is not USER
     * @author Jeetanshu Srivastava
     */
    async checkUser(userType: string, walletAddress: string): Promise<any> {
        try {
            if(userType != Constants.USER) {
                throw new UnauthorizedException('Unauthorized');
            }
            const user = await this.userRepository.isUserValid(walletAddress);
            if(!user) {
                throw new UnauthorizedException("Unauthorized");
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * @description checkUser will check the userType, it will return Boolean depending upon userType match
     * @param userType
     * @returns it will return false if userType is not ADMIN
     * @author Jeetanshu Srivastava
     */
    async checkAdmin(userType: string): Promise<any> {
        try {
            if(userType != Constants.ADMIN) {
                throw new UnauthorizedException('Unauthorized');
            }
        } catch (error) {
            throw new Error(error);
        }
    }
    
}