import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Signup, LoginDto } from './dto';
import type { Request, Response } from 'express';

@Controller('/auth')
export class AuthControllers {
  constructor(private authService: AuthService) {}

  @HttpCode(201)
  @Post('/signup')
  async signup(@Body() dto: Signup, @Res({ passthrough: true }) res: Response) {
    try {
      return this.authService.signup(dto, res);
    } catch (error) {
      console.log('error in signup', error);
    }
  }

  @HttpCode(200)
  @Post('/login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      return this.authService.login(dto, res);
    } catch (error) {
      console.log('error in login', error);
    }
  }

  @HttpCode(200)
  @Post('/refresh')
  async refresh(@Body() body: { userId: string; refreshToken: string }) {
    try {
      return this.authService.refreshTokens(body.userId, body.refreshToken);
    } catch (error) {
      console.log('error in refresh token generation', error);
    }
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const refresh_token = req.cookies?.refresh_token;

      // console.log('Refresh token from cookie:', refresh_token);

      if (!refresh_token) throw new ForbiddenException('Access denied');

      await this.authService.logout(refresh_token);

      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      console.log('error in logout', error);
    }
  }
}
