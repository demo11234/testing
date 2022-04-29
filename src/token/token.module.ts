import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { JwtModule } from '@nestjs/jwt';
import { Constants } from 'shared/Constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tokens } from './entities/tokens.entity';
import { ResponseModel } from 'src/responseModel';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/user/repositories/user.repository';
import { Chains } from 'src/chains/entities/chains.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: Constants.JWT_SECRET_KEY,
      signOptions: { expiresIn: Constants.USER_TOKEN_VALIDITY },
    }),
    TypeOrmModule.forFeature([Tokens, Chains]),
  ],
  providers: [TokenService, ResponseModel, AuthService, UserRepository],
  controllers: [TokenController],
})
export class TokenModule {}
