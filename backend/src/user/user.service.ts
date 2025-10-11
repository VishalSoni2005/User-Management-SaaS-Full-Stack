import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { AppLoggerService } from 'src/app-logger/app-logger.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: AppLoggerService,
  ) {}

  async create(createDto: CreateUserDto) {
    this.logger.info('Create user attempt in service');
    try {
      const hash = await argon2.hash(createDto.password);
      this.logger.debug('Password hashed successfully in service');
      const user = await this.prisma.user.create({
        data: {
          firstName: createDto.firstName!,
          lastName: createDto.lastName,
          email: createDto.email,
          role: createDto.role,

          hash,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      });
      this.logger.info('User created successfully in service');
      return user;
    } catch (error: any) {
      this.logger.error('Error in create user service', error);
      // Prisma unique error code for Mongo is also P2002
      if (error.code === 'P2002') {
        throw new BadRequestException('Email already in use');
      }
      throw new BadRequestException('Something went wrong');
    }
  }

  async findAll() {
    this.logger.info('Get all users attempt in service');
    try {
      const all_users = this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if ((await all_users).length === 0)
        throw new NotFoundException('No users found');

      this.logger.info('All users fetched successfully in service');
      return all_users;
    } catch (error) {
      this.logger.error('Error in find all users service', error);
      throw new NotFoundException('No users found');
    }
  }

  async findOneById(id: string) {
    this.logger.info(`Get user by id attempt: ${id}`);
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) throw new NotFoundException('User not found');

      this.logger.info(`User found with id: ${id}`);
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  // Admin list: pagination, search, filter by role, sort
  // async findAll(params: {
  //   page?: number;
  //   limit?: number;
  //   search?: string;
  //   role?: string;
  //   sort?: string;
  // }) {
  //   const page = Math.max(params.page ?? 1, 1);
  //   const limit = Math.min(Math.max(params.limit ?? 10, 1), 100);
  //   const skip = (page - 1) * limit;

  //   const where: any = {};
  //   if (params.search) {
  //     where.OR = [
  //       { email: { contains: params.search, mode: 'insensitive' } },
  //       { firstName: { contains: params.search, mode: 'insensitive' } },
  //       { lastName: { contains: params.search, mode: 'insensitive' } },
  //     ];
  //   }
  //   if (params.role) where.role = params.role;

  //   let orderBy: any = { createdAt: 'desc' };
  //   if (params.sort) {
  //     const [field, dir] = params.sort.split(':');
  //     orderBy = { [field]: dir === 'desc' ? 'desc' : 'asc' };
  //   }

  //   const [items, total] = await Promise.all([
  //     this.prisma.user.findMany({
  //       where,
  //       orderBy,
  //       skip,
  //       take: limit,
  //       select: {
  //         id: true,
  //         email: true,
  //         firstName: true,
  //         lastName: true,
  //         role: true,
  //         createdAt: true,
  //         updatedAt: true,
  //       },
  //     }),
  //     this.prisma.user.count({ where }),
  //   ]);

  //   return {
  //     items,
  //     total,
  //     page,
  //     pages: Math.ceil(total / limit),
  //     limit,
  //   };
  // }
  // findOneById(id: string) {
  //   return this.prisma.user.findUnique({
  //     where: { id },
  //     select: {
  //       id: true,
  //       firstName: true,
  //       lastName: true,
  //       email: true,
  //       role: true,
  //       createdAt: true,
  //     },
  //   });
  // }

  async updateById(id: string, dto: UpdateUserDto) {
    this.logger.info(`Update user by id attempt: ${id}`);
    try {
      const exists = await this.prisma.user.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('User not found');

      const updated = await this.prisma.user.update({
        where: { id },
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: dto.role,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          updatedAt: true,
        },
      });
      this.logger.info(`User updated successfully with id: ${id}`);
      return { updated: updated, success: true };
    } catch (error) {
      console.log(error);
    }
  }

  async removeById(id: string) {
    this.logger.info(`Delete user by id attempt: ${id}`);
    try {
      await this.prisma.user.delete({ where: { id } });
      this.logger.info(`User deleted successfully with id: ${id}`);
      return { success: true };
    } catch (error) {
      this.logger.error('Error in delete user service', error);
      throw new NotFoundException('User not found');
    }
  }

  async findByEmail(email: string) {
    this.logger.info(`Find user by email attempt: ${email}`);
    try {
      const unique_user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!unique_user) throw new NotFoundException('User not found');
      this.logger.info(`User found with email: ${email}`);
      return unique_user;
    } catch (error) {
      console.log(error);
    }
  }
}
