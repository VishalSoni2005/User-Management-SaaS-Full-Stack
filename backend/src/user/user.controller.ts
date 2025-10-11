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
import { AppLoggerService } from 'src/app-logger/app-logger.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UserResponseDto, UserProfileDto } from './dto/user-response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: AppLoggerService,
  ) {}

  // Create User (Admin only)
  @Post('/createuser')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Create a new user (Admin only)',
    description:
      'Allows admin to create a new user. Returns created user details.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or missing required fields',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — only admin can perform this action',
  })
  async create(@Body() dto: CreateUserDto) {
    this.logger.info('🟢 Create user attempt');
    try {
      return await this.usersService.create(dto);
    } catch (error) {
      this.logger.error('❌ Error in create user controller', error);
      throw error;
    }
  }

  // Get All Users (Admin only)
  @Get('/getallusers')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Get all users (Admin only)',
    description:
      'Retrieves a list of all registered users. Admin access required.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users retrieved successfully',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — only admin can perform this action',
  })
  async findAll() {
    this.logger.info('🟡 Get all users attempt');
    try {
      return await this.usersService.findAll();
    } catch (error) {
      this.logger.error('❌ Error in findAll users controller', error);
      throw error;
    }
  }

  // Get Current User Profile
  @Get('me')
  @ApiOperation({
    summary: 'Get current logged-in user profile',
    description:
      'Returns the profile information of the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized — missing or invalid JWT token',
  })
  async me(@Req() req: any) {
    this.logger.info('👤 Get current user attempt');
    try {
      const userId = req.user.userId; // ✅ Added by JwtAuthGuard
      return await this.usersService.findOneById(userId);
    } catch (error) {
      this.logger.error('❌ Error in me controller', error);
      throw error;
    }
  }

  // Get Single User by ID (Admin only)
  @Get(':id')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Get a single user by ID (Admin only)',
    description:
      'Fetches detailed information about a specific user by their ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '66f3e91e2a9e8b4f124f03d2',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findOne(@Param() param: IdDto) {
    this.logger.info(`🔍 Get user by ID attempt: ${param.id}`);
    try {
      return await this.usersService.findOneById(param.id);
    } catch (error) {
      this.logger.error('❌ Error in findOne controller', error);
      throw error;
    }
  }

  // Update User (Admin only)
  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Update user by ID (Admin only)',
    description:
      'Updates an existing user’s details. Only admins are allowed to perform this operation.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '66f3e91e2a9e8b4f124f03d2',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    this.logger.info(`✏️ Update user by ID attempt: ${id}`);
    try {
      return await this.usersService.updateById(id, dto);
    } catch (error) {
      this.logger.error('❌ Error in update controller', error);
      throw error;
    }
  }

  // Delete User (Admin only)
  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Delete user by ID (Admin only)',
    description:
      'Deletes a specific user by ID. Only admins can perform this operation.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '66f3e91e2a9e8b4f124f03d2',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      example: { success: true, message: 'User deleted successfully' },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async remove(@Param('id') id: string) {
    this.logger.info(`❌ Delete user by ID attempt: ${id}`);
    try {
      return await this.usersService.removeById(id);
    } catch (error) {
      this.logger.error('❌ Error in remove controller', error);
      throw error;
    }
  }
}

// import {
//   Controller,
//   Post,
//   Body,
//   Get,
//   UseGuards,
//   Req,
//   Param,
//   Put,
//   Delete,
// } from '@nestjs/common';
// import { UsersService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { JwtAuthGuard } from 'src/common/guard';
// import { IdDto } from 'src/common/dtos/id.dto';
// import { RolesGuard } from 'src/common/guard/roles.guard';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { AppLoggerService } from 'src/app-logger/app-logger.service';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';

// @ApiTags('Users')
// @Controller('users')
// @UseGuards(JwtAuthGuard, RolesGuard)
// export class UsersController {
//   constructor(
//     private usersService: UsersService,
//     private readonly logger: AppLoggerService,
//   ) {}

//   @ApiResponse({ status: 201, description: 'User created successfully' })
//   @Post('/createuser')
//   @Roles('ADMIN')
//   async create(@Body() dto: CreateUserDto) {
//     this.logger.info('Create user attempt');
//     try {
//       return this.usersService.create(dto);
//     } catch (error) {
//       this.logger.error('Error in create user controller', error);
//     }
//   }

//   @ApiResponse({ status: 200, description: 'Get all users' })
//   @Get('/getallusers')
//   @Roles('ADMIN')
//   async findAll() {
//     this.logger.info('Get all users attempt');
//     try {
//       return this.usersService.findAll();
//     } catch (error) {
//       this.logger.error('Error in find all users controller', error);
//       console.log(' error in findAll controller', error);
//     }
//   }

//   @Get('me')
//   async me(@Req() req: any) {
//     this.logger.info('Get current user attempt');
//     try {
//       //! user is added to req by JwtAuthGuard after validating jwt token
//       const userId = req.user.userId;
//       return this.usersService.findOneById(userId);
//     } catch (error) {
//       this.logger.error('Error in me controller', error);
//       console.log(' error in me controller', error);
//     }
//   }

//   @Get(':id')
//   @Roles('ADMIN')
//   async findOne(@Param() param: IdDto, @Req() req: any) {
//     this.logger.info(`Get user by id attempt: ${param.id}`);
//     try {
//       return this.usersService.findOneById(param.id);
//     } catch (error) {
//       this.logger.error('Error in findOne controller', error);
//       console.log(' error in findOne controller', error);
//     }
//   }

//   @Put(':id')
//   @Roles('ADMIN')
//   async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
//     this.logger.info(`Update user by id attempt: ${id}`);
//     try {
//       return this.usersService.updateById(id, dto);
//     } catch (error) {
//       this.logger.error('Error in update controller', error);
//       console.log(' error in update controller', error);
//     }
//   }

//   @Delete(':id')
//   @Roles('ADMIN')
//   async remove(@Param('id') id: string) {
//     this.logger.info(`Delete user by id attempt: ${id}`);
//     try {
//       return this.usersService.removeById(id);
//     } catch (error) {
//       this.logger.error('Error in remove controller', error);
//       console.log(' error in remove controller', error);
//     }
//   }
// }
