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
import { ServicesService } from 'src/services/services.service';
import { ConfigService } from 'aws-sdk';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Collection } from 'src/collections/entities/collection.entity';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: Constants.JWT_SECRET_KEY,
      signOptions: { expiresIn: Constants.USER_TOKEN_VALIDITY },
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      Notification,
      Category,
      User,
      Collection,
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ResponseModel,
    AuthService,
    FileUpload,
    NotificationService,
    ServicesService,
    ConfigService,
  ],
})
export class UserModule {}
