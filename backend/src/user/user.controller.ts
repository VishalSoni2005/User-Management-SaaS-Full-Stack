import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Req,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/guard';
import { Roles } from 'src/common/decorator';
import { RolesGuard } from 'src/common/guard/role.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Admin creates user (or you can have /auth/signup public)
  @Post()
  @Roles('ADMIN')
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // Admin list with pagination/search/filter
  @Get()
  @Roles('ADMIN')
  async findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('sort') sort?: string,
  ) {
    return this.usersService.findAll({ page, limit, search, role, sort });
  }

  // Get profile (self) or admin get any user
  @Get('me')
  async me(@Req() req: any) {
    const userId = req.user.userId;
    return this.usersService.findOneById(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const auth = req.user;
    if (auth.role !== 'ADMIN' && auth.userId !== id) {
      return { statusCode: 403, message: 'Forbidden' };
    }
    return this.usersService.findOneById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {
    const auth = req.user;
    if (auth.role !== 'ADMIN' && auth.userId !== id) {
      return { statusCode: 403, message: 'Forbidden' };
    }
    return this.usersService.updateById(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.usersService.removeById(id);
  }
}

// import { Controller, Get, Req, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { JwtGuard } from 'src/common/guard';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Controller('users')
// export class UserController {
//   constructor(private prisma: PrismaService) {}

//   @Get('/getAllUsers')
//   async findAll() {
//     const users = await this.prisma.user.findMany();

//     return users;
//   }

//   @UseGuards(JwtGuard)
//   @Get('me')
//   getMe(@Req() req: Request) {
//     // console.log({
//     //   user: req.user,
//     // });
//     return { msg: 'This is a protected route' };
//   }
// }
