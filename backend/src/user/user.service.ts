import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateUserDto) {
    try {
      const hash = await argon2.hash(createDto.password);
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
      return user;
    } catch (error: any) {
      // Prisma unique error code for Mongo is also P2002
      if (error.code === 'P2002') {
        throw new BadRequestException('Email already in use');
      }
      throw new BadRequestException('Something went wrong');
    }
  }

  async findAll() {
    try {
      const hlo = this.prisma.user.findMany({
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
      console.log('[userService] findall services called', hlo); // --- IGNORE ---
      return hlo;
    } catch (error) {
      throw new NotFoundException('No users found');
    }
  }

  async findOneById(id: string) {
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
      console.log('findonebyid services called'); // --- IGNORE ---

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
      return { updated: updated, success: true };
    } catch (error) {
      console.log(error);
    }
  }

  async removeById(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
      return { success: true };
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async findByEmail(email: string) {
    try {
      return this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      console.log(error);
    }
  }
}
