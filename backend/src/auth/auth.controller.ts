import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthControllers {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}

// import { Body, Controller, Post, Req } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import type { Request } from 'express';
// import { AuthDto } from './dto';
// import { User } from 'generated/prisma';

// @Controller('/auth')
// export class AuthControllers {
//   constructor(private authService: AuthService) {}

//   @Post('/signup')
//   // signup(@Body() dto: AuthDto) {
//   signup(@Body() dto: AuthDto) {
//     {
//       try {
//         // console.log('dto in signup service:', dto);
//         // console.log('dto instanceof AuthDto?', dto instanceof AuthDto); // should be true
//         return this.authService.signup(dto);
//       } catch (error) {
//         console.log('Error in signup:', error);
//       }
//     }
//   }

//   @Post('/signin')
//   signin(@Body() dto: AuthDto) {
//     req.user;
//     return this.authService.signin(dto);
//   }
// }
