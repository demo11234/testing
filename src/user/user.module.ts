import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { ResponseModel } from 'src/responseModel';
import { AuthService } from 'src/auth/auth.service';
import { Constants } from 'shared/Constants';

import { FileUpload } from './utils/s3.upload';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/entity/notification.entity';

import { Category } from 'src/admin/entities/categories.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: Constants.JWT_SECRET_KEY,
      signOptions: { expiresIn: Constants.USER_TOKEN_VALIDITY },
    }),
    TypeOrmModule.forFeature([UserRepository,Notification, Category]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ResponseModel,
    AuthService,
    FileUpload,
    NotificationService,
  ],
})
export class UserModule {}
