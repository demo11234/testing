import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/user/repositories/user.repository';

import { Constants } from 'shared/Constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Constants.JWT_SECRET_KEY,
    });
  }

  /**
   * Validating payload
   * @param payload
   * @returns admin
   * @author Mohan Chaudhari
   */
  async validate(payload: any): Promise<any> {
    const bufferObj = Buffer.from(payload.data, 'base64');
    const decodedString = bufferObj.toString('utf8');

    if (decodedString === Constants.USER) {
      // const user = await this.userRepository.isUserValid(payload.walletAddress);
      // if (!user) {
      //   throw new UnauthorizedException('Unauthorized');
      // }
      return {
        walletAddress: payload.walletAddress,
        userId: payload.userId,
        data: decodedString,
      };
    } else if (decodedString === Constants.ADMIN) {
      return {
        username: payload.sub,
        data: decodedString,
      };
    }
  }
}
