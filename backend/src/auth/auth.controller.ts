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
import { logMsg } from 'src/common/constants/log-message.contant';

@ApiTags('Auth')
@Controller('auth')
export class AuthControllers {
  private readonly context = 'AuthController';

  constructor(
    private readonly authService: AuthService,
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
        success: true,
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
  async signup(@Body() dto: Signup, @Res() res: Response) {
    const action = 'Signup';
    this.logger.info(`[${this.context}] ${action} - Started`);

    try {
      const result = await this.authService.signup(dto);

      // Set refresh token cookie
      this.setRefreshCookie(res, result.refresh_token);

      this.logger.info(
        `[${this.context}] ${action} - Success for email: ${dto.email}`,
      );

      // Send response explicitly (required when using @Res)
      return res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        ...result,
      });
    } catch (error) {
      this.logger.error(
        `[${this.context}] ${action} - Failed for email: ${dto.email}`,
        error,
      );

      return res.status(400).json({
        success: false,
        message: 'Signup failed',
        error: error.message || 'Access denied',
      });
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'User logged in successfully.',
    schema: {
      example: {
        success: true,
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
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const action = 'Login';
    this.logger.info(
      `[${this.context}] ${action} - Started for email: ${dto.email}`,
    );

    try {
      const result = await this.authService.login(dto);

      const { user, access_token, refresh_token } = result;

      this.setRefreshCookie(res, refresh_token);

      this.logger.info(
        `[${this.context}] ${action} - Success for email: ${dto.email}`,
      );
      return res.status(200).json({
        success: true,
        message: 'User logged in successfully.',
        access_token,
        refresh_token,
        user,
      });
    } catch (error) {
      this.logger.error(
        `[${this.context}] ${action} - Failed for email: ${dto.email}`,
        error,
      );
      // throw new ForbiddenException('Access denied');

      return res.status(400).json({
        success: false,
        message: 'Login failed',
        error: error.message || 'Access denied',
      });
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiOkResponse({
    description: 'Tokens refreshed successfully.',
    schema: {
      example: {
        success: true,
        accessToken: 'jwt_access_token',
        refreshToken: 'jwt_refresh_token',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or invalid refresh token.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error during refresh.',
  })
  async refresh(@Body() body: { userId: string; refreshToken: string }) {
    const action = 'RefreshTokens';
    this.logger.info(
      `[${this.context}] ${action} - Started for userId: ${body.userId}`,
    );

    try {
      const result = await this.authService.refreshTokens(
        body.userId,
        body.refreshToken,
      );
      this.logger.info(
        `[${this.context}] ${action} - Success for userId: ${body.userId}`,
      );
      return {
        success: true,
        message: 'Tokens refreshed successfully.',
        ...result,
      };
    } catch (error) {
      this.logger.error(
        `[${this.context}] ${action} - Failed for userId: ${body.userId}`,
        error,
      );
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout a user',
    description:
      'Logs out a user by deleting their refresh token and clearing cookies.',
  })
  @ApiOkResponse({
    description: 'User logged out successfully.',
    schema: {
      example: { success: true, message: 'Logged out successfully.' },
    },
  })
  @ApiBadRequestResponse({ description: 'Missing or invalid refresh token.' })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error during logout.',
  })
  async logout(@Req() req: Request, @Res() res: Response) {
    const action = 'Logout';
    this.logger.info(`[${this.context}] ${action} - Started`);

    // this.logger.info(logMsg.info, `[${this.context}] ${actions} - Started`);

    try {
      const refreshToken = req.cookies?.refresh_token;
      if (!refreshToken) {
        this.logger.warn(
          `[${this.context}] ${action} - No refresh token in cookies`,
        );
        throw new ForbiddenException('Access denied');
      }

      await this.authService.logout(refreshToken);

      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      this.logger.info(`[${this.context}] ${action} - Success`);
      return res
        .status(200)
        .json({ success: true, message: 'Logged out successfully.' });
    } catch (error) {
      this.logger.error(`[${this.context}] ${action} - Failed`, error);
      return res.status(400).json({
        success: false,
        message: 'Logout failed',
        error: error.message || 'Access denied',
      });
    }
  }
}
