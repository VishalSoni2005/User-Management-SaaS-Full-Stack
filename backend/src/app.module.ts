import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AppLoggerModule } from './app-logger/app-logger.module';
import { AppLoggerService } from './app-logger/app-logger.service';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { RewardModule } from './reward/reward.module';
import { RedemptionModule } from './redemption/redemption.module';
import { TripModule } from './trip/trip.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    AppLoggerModule,

    //! Config
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    LeaderboardModule,

    RewardModule,

    RedemptionModule,

    TripModule,
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
