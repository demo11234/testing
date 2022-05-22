import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Constants } from 'shared/Constants';
import { AuthService } from 'src/auth/auth.service';
import { Collection } from 'src/collections/entities/collection.entity';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { ResponseModel } from 'src/responseModel';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';
import { Report } from './entities/report.entities';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [
    JwtModule.register({
      secret: Constants.JWT_SECRET_KEY,
      signOptions: { expiresIn: Constants.USER_TOKEN_VALIDITY },
    }),
    TypeOrmModule.forFeature([Report, NftItem, Collection, User]),
  ],
  controllers: [ReportController],
  providers: [ReportService, ResponseModel, AuthService, UserRepository],
})
export class ReportModule {}
