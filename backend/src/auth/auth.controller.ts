import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { JwtAuthGuard } from 'src/common/guard';

@Controller('auth')
export class AuthControllers {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() dto: AuthDto) {
    console.log('dto', dto);

    return this.authService.signup(dto);
  }

  @HttpCode(200)
  @Post('login')
  async signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Post('refresh')
  async refresh(@Body() body: { userId: string; refreshToken: string }) {
    return this.authService.refreshTokens(body.userId, body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    const userId = req.user.userId;
    return this.authService.logout(userId);
  }
}

// import {
//   Body,
//   Controller,
//   HttpCode,
//   HttpStatus,
//   Post,
//   Req,
// } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthDto, RefreshTokenDto } from './dto';

// @Controller('auth')
// export class AuthControllers {
//   constructor(private authService: AuthService) {}

//   @Post('signup')
//   signup(@Body() dto: AuthDto) {
//     return this.authService.signup(dto);
//   }

//   @HttpCode(HttpStatus.OK)
//   @Post('signin')
//   signin(@Body() dto: AuthDto) {
//     return this.authService.signin(dto);
//   }
// }
