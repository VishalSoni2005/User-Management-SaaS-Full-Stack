// the module file is class anotated with @module decorator

import { Module } from '@nestjs/common';
import { AuthControllers } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'vishal',
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthControllers],
  exports: [],
})
export class AuthModule {}
