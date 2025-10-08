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

@Controller('users')
// @UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
    // console.log('req of user content =>', req.user);
    // const auth = req.user;

    // if (auth.role === 'ADMIN') {
    // return this.usersService.findAll();
    // } else {
    //   return this.usersService.findOneById(auth.userId);
    // }
  }

  // Get profile (self) or admin get any user
  @Get('me')
  async me(@Req() req: any) {
    const userId = req.user.userId; // provide userid
    return this.usersService.findOneById(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    // const auth = req.user;
    // if (auth.role !== 'ADMIN' && auth.userId !== id) {
    //   return { statusCode: 403, message: 'Forbidden' };
    // }
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
  async remove(@Param('id') id: string) {
    return this.usersService.removeById(id);
  }
}
