import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Constants } from 'shared/Constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
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

    let bufferObj = Buffer.from(payload.data, "base64");
    let decodedString = bufferObj.toString("utf8");

    if(decodedString === Constants.USER) {
      return { 
        walletAddress : payload.walletAddress,
        data : decodedString
      };
    }
    else if(decodedString === Constants.ADMIN) {
      return { 
        username : payload.sub,
        data : decodedString
      };
    }
  }
}
