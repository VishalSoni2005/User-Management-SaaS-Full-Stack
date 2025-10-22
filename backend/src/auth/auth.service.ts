import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Signup, LoginDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AppLoggerService } from 'src/app-logger/app-logger.service';
import generateAvatar from 'src/common/utils/UserAvatar';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private readonly logger: AppLoggerService,
  ) {}

  private async getTokens(
    userId: string,
    email: string,
    role: string,
    firstName: string,
    lastName?: string | null,
    avatar?: string | null,
  ) {
    try {
      // step 1: getting secrets
      const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET');
      const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');

      if (!accessSecret || !refreshSecret) {
        throw new Error('JWT secrets not configured');
      }

      //? step 2: payload
      const payload = {
        userId: userId,
        email: email,
        role: role,
        firstName: firstName,
        lastName: lastName,
        avatar: avatar,
      };

      console.log('payload', payload);

      //* step 3: accesstoken and refreshtoken
      //! access token have payload
      const access_token = await this.jwt.signAsync(payload, {
        secret: accessSecret,
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN') || '5m',
      });

      const refresh_token = await this.jwt.signAsync(
        { userId: userId }, //! refresh token doesn't have payload
        {
          secret: refreshSecret,
          expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
        },
      );

      return { access_token, refresh_token };
    } catch (error) {
      this.logger.error('Error in getting tokens', error);
      throw error;
    }
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    try {
      const hashed = await argon2.hash(refreshToken); // hash the refresh token before storing
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: hashed },
      });
    } catch (error) {
      this.logger.error('Error in updating refresh token', error);
      throw error;
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    this.logger.log(`Refreshing tokens for user: ${userId}`);
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.refreshToken)
        throw new ForbiddenException('Access denied');

      const isValid = await argon2.verify(user.refreshToken, refreshToken);
      if (!isValid) throw new ForbiddenException('Invalid refresh token');

      const tokens = await this.getTokens(
        user.id,
        user.email,
        user.avatar,
        user.role,
        user.firstName,
        user.lastName,
      );
      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    } catch (error) {
      this.logger.error('Error in refreshing tokens', error);
      throw error;
    }
  }

  async signup(dto: Signup) {
    this.logger.info(
      `Signup attempt for email: ${dto.email}`,
      AuthService.name,
      // 'signup',
    );
    try {
      // console.log('Dtos', dto);

      const hash = await argon2.hash(dto.password);
      this.logger.debug('Password hashed successfully');

      //! Avatar url

      const avatarURL = generateAvatar(dto.firstName, dto.email);

      const user = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          role: dto.role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER', //! ADMIN or USER

          avatar: avatarURL,
          hash: hash,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          avatar: true,
          createdAt: true,
        },
      });
      this.logger.log(`User created with ID: ${user.id}`);

      const tokens = await this.getTokens(
        user.id,
        user.email,
        user.role,
        user.firstName,
        user.lastName,
        user.avatar,
      );

      this.logger.log(`Tokens generated for user ID: ${user.id}`);
      // store hashed refresh token
      await this.updateRefreshToken(user.id, tokens.refresh_token);

      // Set refresh cookie
      // this.setRefreshCookie(res, tokens.refreshToken);
      return {
        user,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    } catch (error) {
      this.logger.error(
        'Error during signup',
        error instanceof Error ? error.stack : '',
      );
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // unique constraint failed
          throw new ForbiddenException('Email already registered');
        }
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    this.logger.debug(`Login attempt for email: ${dto.email}`);
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) throw new NotFoundException('User not found');

      if (user.isDeleted) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { isDeleted: false },
        });
        this.logger.info(`User restored successfully with id: ${user.id}`);
      }

      this.logger.log(`User found with ID: ${user.id}`);

      const pwMatches = await argon2.verify(user.hash, dto.password);
      if (!pwMatches) throw new ForbiddenException('Invalid credentials');

      this.logger.log(`Password matched for user ID: ${user.id}`);

      const tokens = await this.getTokens(
        user.id,
        user.email,
        user.role,
        user.firstName,
        user.lastName,
        user.avatar,
      );
      await this.updateRefreshToken(user.id, tokens.refresh_token);

      this.logger.log(`Tokens generated for user ID: ${user.id}`);

      // Set refresh cookie
      // this.setRefreshCookie(res, tokens.refreshToken);

      const safeUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      };

      return {
        user: safeUser,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    } catch (error) {
      this.logger.error(
        'Error during login',
        error instanceof Error ? error.stack : '',
      );
      throw error;
    }
  }

  async logout(refreshToken: string) {
    this.logger.info(`Logout attempt using refresh token`);

    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      console.log(payload);

      if (!payload) {
        throw new ForbiddenException('Invalid token payload');
      }

      const userId = payload.userId;
      console.log('user id', userId);

      const user = await this.prisma.user.findFirst({
        where: { id: userId },
      });

      if (!user) throw new NotFoundException('User not found');

      if (!user.refreshToken) {
        throw new ForbiddenException('No active session');
      }

      const isValid = await argon2.verify(user.refreshToken, refreshToken);
      if (!isValid) {
        throw new ForbiddenException(
          'Token mismatch — possibly expired or reused',
        );
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });

      this.logger.log(`User ${user.email} successfully logged out`);
      return { success: true };
    } catch (error) {
      this.logger.error('Error during logout', error.stack);
      throw error;
    }
  }
}
