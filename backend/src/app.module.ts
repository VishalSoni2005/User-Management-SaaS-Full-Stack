import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AppLoggerModule } from './app-logger/app-logger.module';
import { LoggerModule } from 'pino-nestjs';
import { AppLoggerService } from './app-logger/app-logger.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    BookmarkModule,
    PrismaModule,
    AppLoggerModule,

    //! Pino Logger Module
    // LoggerModule.forRoot(),
    //! Custom Logger Module
    // AppLoggerModule.forRoot({
    //   level: process.env.LOG_LEVEL || 'debug',
    //   timestamp: true,
    //   colorize: true,
    //   fileTransport: process.env.NODE_ENV === 'production',
    //   logFile: 'application.log',
    //   errorFile: 'errors.log',
    // }),

    //! Config
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [AppLoggerService],
})

//! Middleware
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
