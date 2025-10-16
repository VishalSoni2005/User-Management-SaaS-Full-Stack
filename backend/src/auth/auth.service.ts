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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private readonly logger: AppLoggerService,
  ) {}
  private parseExpiryToMs(exp: string) {
    // simple parser for formats like '900s', '15m', '7d'
    if (exp.endsWith('ms')) return parseInt(exp.slice(0, -2), 10);
    if (exp.endsWith('s')) return parseInt(exp.slice(0, -1), 10) * 1000;
    if (exp.endsWith('m')) return parseInt(exp.slice(0, -1), 10) * 60 * 1000;
    if (exp.endsWith('h'))
      return parseInt(exp.slice(0, -1), 10) * 60 * 60 * 1000;
    if (exp.endsWith('d'))
      return parseInt(exp.slice(0, -1), 10) * 24 * 60 * 60 * 1000;
    // fallback 7 days
    return 7 * 24 * 60 * 60 * 1000;
  }

  private setRefreshCookie(res: Response, refreshToken: string) {
    const isProd = process.env.NODE_ENV === 'production';
    const maxAge = this.parseExpiryToMs(
      process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
      maxAge,
    });
  }

  private async getTokens(
    userId: string,
    email: string,
    role: string,
    firstName: string,
    lastName?: string | null,
  ) {
    try {
      // step 1: getting secrets
      const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET');
      const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');

      console.log(AuthService.name);

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
      };

      //* step 3: accesstoken and refreshtoken
      //! access token have payload
      const accessToken = await this.jwt.signAsync(payload, {
        secret: accessSecret,
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m',
      });

      const refreshToken = await this.jwt.signAsync(
        { sub: userId }, //! refresh token doesn't have payload
        {
          secret: refreshSecret,
          expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
        },
      );

      return { accessToken, refreshToken };
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
        user.role,
        user.firstName,
        user.lastName,
      );
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      };
    } catch (error) {
      this.logger.error('Error in refreshing tokens', error);
      throw error;
    }
  }

  async signup(dto: Signup, res: Response) {
    this.logger.info(
      `Signup attempt for email: ${dto.email}`,
      AuthService.name,
      // 'signup',
    );
    try {
      const hash = await argon2.hash(dto.password);
      this.logger.debug('Password hashed successfully');

      const user = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          role: dto.role === 'ADMIN' ? 'ADMIN' : 'USER',

          hash: hash,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
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
      );
      this.logger.log(`Tokens generated for user ID: ${user.id}`);
      // store hashed refresh token
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      // Set refresh cookie
      this.setRefreshCookie(res, tokens.refreshToken);
      return {
        user,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
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

  async login(dto: LoginDto, res: Response) {
    this.logger.debug(`Login attempt for email: ${dto.email}`);
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) throw new NotFoundException('User not found');

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
      );
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      this.logger.log(`Tokens generated for user ID: ${user.id}`);

      // Set refresh cookie
      this.setRefreshCookie(res, tokens.refreshToken);

      const safeUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };

      return {
        user: safeUser,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      };
    } catch (error) {
      this.logger.error(
        'Error during login',
        error instanceof Error ? error.stack : '',
      );
      throw error;
    }
  }

  async logout(refresh_token: string) {
    this.logger.info(`Logout attempt for user ID: ${refresh_token}`);
    try {
      const payload = await this.jwt.verifyAsync(refresh_token, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      if (!payload || typeof payload === 'string' || !payload.sub) {
        throw new ForbiddenException('Invalid token payload');
      }

      const userId = payload.sub;
      // Find user by refresh token

      const user = await this.prisma.user.findFirst({
        where: { id: userId, refreshToken: { not: null } },
      });

      if (!user) throw new NotFoundException('User not found');

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null },
      });
      this.logger.log(`Refresh token deleted for user email: ${user.email}`);
      return { success: true };
    } catch (error) {
      this.logger.error(
        'Error during logout',
        error instanceof Error ? error.stack : '',
      );
      throw error;
    }
  }
}
