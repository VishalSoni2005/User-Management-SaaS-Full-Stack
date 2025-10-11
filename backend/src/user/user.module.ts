import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { AppLoggerModule } from 'src/app-logger/app-logger.module';

@Module({
  imports: [AuthModule, AppLoggerModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
