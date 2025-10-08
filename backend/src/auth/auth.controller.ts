import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Signup, LoginDto } from './dto';
import { JwtAuthGuard } from 'src/common/guard';

@Controller('/auth')
export class AuthControllers {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() dto: Signup) {
    console.log('dto', dto);

    return this.authService.signup(dto);
  }

  @HttpCode(200)
  @Post('/login')
  async login(@Body() dto: LoginDto) {
    // console.log('dto', dto);
    return this.authService.login(dto);
  }

  @Post('refresh')
  async refresh(@Body() body: { userId: string; refreshToken: string }) {
    return this.authService.refreshTokens(body.userId, body.refreshToken);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('logout')
  // async logout(@Req() req: any) {
  //   const userId = req.user.userId;
  //   return this.authService.logout(userId);
  // }
}
