import {
  CacheInterceptor,
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './core/logger.middleware';
import { DatabaseModule } from './database/database.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import * as redisStore from 'cache-manager-redis-store';
import { ResponseModel } from './responseModel';
import { AuthModule } from './auth/auth.module';
import { ChainsModule } from './chains/chains.module';
import { TokenModule } from './token/token.module';
import { CollectionsModule } from './collections/collections.module';
import { UtilsModule } from './utils/utils.module';
import { NotificationModule } from './notification/notification.module';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL'),
        limit: config.get('THROTTLE_LIMIT'),
      }),
    }),
    // CacheModule.register({
    //   isGlobal: true,
    //   ttl: 60,
    //   max: 1000,
    //   store: redisStore,
    //   socket: {
    //     host: '127.0.0.1',
    //     port: 6379,
    //   },
    // }),
    DatabaseModule,
    UserModule,
    AdminModule,
    AuthModule,
    ChainsModule,
    TokenModule,
    NotificationModule,
    CollectionsModule,
    UtilsModule,
    ActivityModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ResponseModel,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/**');
  }
}
