import { Injectable } from '@nestjs/common';
import { Constants } from 'shared/Constants';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
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
            const payload = { walletAddress };

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
}