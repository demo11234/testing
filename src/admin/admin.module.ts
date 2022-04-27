import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { LocalStrategy } from '../auth/local.strategy';
import { JwtStrategy } from '../auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { Constants } from 'shared/Constants';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/user/repositories/user.repository';
import { Category } from './entities/categories.entity';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    LocalStrategy,
    JwtStrategy,
    AuthService,
    UserRepository,
  ],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Admin, Category]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: Constants.JWT_SECRET_KEY,
      signOptions: { expiresIn: Constants.USER_TOKEN_VALIDITY },
    }),
  ],
})
export class AdminModule {}
