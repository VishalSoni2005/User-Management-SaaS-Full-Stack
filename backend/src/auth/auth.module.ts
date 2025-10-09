import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthControllers } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m',
        },
      }),
    }),
  ],

  providers: [AuthService, JwtStrategy],
  controllers: [AuthControllers],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
