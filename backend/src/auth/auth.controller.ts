import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Signup, LoginDto } from './dto';
import type { Request, Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AppLoggerService } from 'src/app-logger/app-logger.service';

@ApiTags('Auth')
@Controller('/auth')
export class AuthControllers {
  constructor(
    private authService: AuthService,
    private readonly logger: AppLoggerService,
  ) {}

  // private setRefreshCookie(res: Response, refreshToken: string) {
  //   const isProd = process.env.NODE_ENV === 'production';
  //   const maxAge = this.parseExpiryToMs(
  //     process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  //   );

  //   res.cookie('refresh_token', refreshToken, {
  //     httpOnly: true,
  //     secure: isProd,
  //     sameSite: 'strict',
  //     path: '/',
  //     maxAge,
  //   });
  // }

  @Post('signup')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Registers a new user in the system and returns authentication tokens.',
  })
  @ApiBody({ type: Signup })
  @ApiOkResponse({
    description: 'User registered successfully.',
    schema: {
      example: {
        message: 'User registered successfully.',
        accessToken: 'jwt_access_token',
        refreshToken: 'jwt_refresh_token',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or email already in use.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error during signup.',
  })
  async signup(@Body() dto: Signup, @Res({ passthrough: true }) res: Response) {
    this.logger.info('Signup attempt is made ');
    try {
      return this.authService.signup(dto, res);
    } catch (error) {
      this.logger.error('Error in signup', error);
      throw new ForbiddenException('Access denied');
    }
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'User logged in successfully.',
    schema: {
      example: {
        message: 'User logged in successfully.',
        accessToken: 'jwt_access_token',
        refreshToken: 'jwt_refresh_token',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or email not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error during login.',
  })
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    try {
      // const data = utilities(res)
      return this.authService.login(dto, res);
    } catch (error) {
      console.log('error in login', error);
      throw new ForbiddenException('Access denied');
    }
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Refresh access token and refresh token' })
  @ApiOkResponse({
    description: 'Tokens refreshed successfully.',
    schema: {
      example: {
        access_token: 'jwt_access_token',
        refresh_token: 'jwt_refresh_token',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or email not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error during refresh.',
  })
  async refresh(@Body() body: { userId: string; refreshToken: string }) {
    try {
      return this.authService.refreshTokens(body.userId, body.refreshToken);
    } catch (error) {
      console.log('error in refresh token generation', error);
    }
  }

  @Post('/logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout a user',
    description: 'Logs out a user by deleting their refresh token.',
  })
  @ApiOkResponse({
    description: 'User logged out successfully.',
    schema: {
      example: {
        success: true,
        message: 'Logged out successfully',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or email not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error during logout.',
  })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const refresh_token = req.cookies?.refresh_token;

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
