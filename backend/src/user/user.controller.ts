/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/common/guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get('/getAllUsers')
  async findAll() {
    const users = await this.prisma.user.findMany();

    return users;
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Get() req: Request) {
    console.log({
      user: req.user,
    });
    return { msg: 'This is a protected route' };
  }
}
