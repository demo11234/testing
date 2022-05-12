import { Module } from '@nestjs/common';
import { ChainsService } from './chains.service';
import { ChainsController } from './chains.controller';
import { ResponseModel } from 'src/responseModel';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/user/repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { Constants } from 'shared/Constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chains } from './entities/chains.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: Constants.JWT_SECRET_KEY,
      signOptions: { expiresIn: Constants.USER_TOKEN_VALIDITY },
    }),
    TypeOrmModule.forFeature([Chains]),
  ],
  providers: [ChainsService, ResponseModel, AuthService, UserRepository],
  controllers: [ChainsController],
  exports: [ChainsService],
})
export class ChainsModule {}
