import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/guard';
import { IdDto } from 'src/common/dtos/id.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import type { Request } from 'express';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Roles('ADMIN')
  async create(@Body() dto: CreateUserDto) {
    try {
      return this.usersService.create(dto);
    } catch (error) {
      console.log(' error in create user controller', error);
    }
  }

  @Get('/getallusers')
  @Roles('ADMIN')
  async findAll() {
    try {
      return this.usersService.findAll();
    } catch (error) {
      console.log(' error in findAll controller', error);
    }
  }

  @Get('me')
  async me(@Req() req: any) {
    try {
      //! user is added to req by JwtAuthGuard after validating jwt token
      const userId = req.user.userId;
      return this.usersService.findOneById(userId);
    } catch (error) {
      console.log(' error in me controller', error);
    }
  }

  @Get(':id')
  @Roles('ADMIN')
  async findOne(@Param() param: IdDto, @Req() req: any) {
    try {
      return this.usersService.findOneById(param.id);
    } catch (error) {
      console.log(' error in findOne controller', error);
    }
  }

  @Put(':id')
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    try {
      // const auth = req.user;
      return this.usersService.updateById(id, dto);
    } catch (error) {
      console.log(' error in update controller', error);
    }
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    try {
      return this.usersService.removeById(id);
    } catch (error) {
      console.log(' error in remove controller', error);
    }
  }
}
