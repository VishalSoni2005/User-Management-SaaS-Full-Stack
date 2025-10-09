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
import { IdDto } from 'src/common/dtos/id.dto';

@Controller('users')
// @UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  async findAll(@Req() req: Request) {
    try {
      return this.usersService.findAll();
    } catch (error) {
      console.log(' error in findAll controller', error);
    }
  }

  @Get('me')
  async me(@Req() req: any) {
    const userId = req.user.userId; // provide userid
    return this.usersService.findOneById(userId);
  }

  @Get(':id')
  async findOne(@Param() param: IdDto, @Req() req: any) {
    return this.usersService.findOneById(param.id);
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
  async remove(@Param('id') id: string) {
    return this.usersService.removeById(id);
  }
}
