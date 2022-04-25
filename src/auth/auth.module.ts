import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { Constants } from 'shared/Constants';

@Module({
  imports: [
    JwtModule.register({
      secret: Constants.JWT_SECRET_KEY,
      signOptions: { expiresIn: Constants.USER_TOKEN_VALIDITY }
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
  ]
})
export class AuthModule {}