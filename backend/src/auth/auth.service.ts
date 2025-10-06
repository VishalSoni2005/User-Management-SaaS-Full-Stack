import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // Create user and return tokens
  async signup(dto: AuthDto) {
    try {
      const hash = await argon2.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          role: true,
          createdAt: true,
        },
      });

      const tokens = await this.getTokens(user.id, user.email, user.role);
      // store hashed refresh token
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        user,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // unique constraint failed
          throw new ForbiddenException('Email already registered');
        }
      }
      throw error;
    }
  }

  // Signin user, return tokens
  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new NotFoundException('User not found');

    const pwMatches = await argon2.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Invalid credentials');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    // return minimal user info and tokens
    const safeUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    return {
      user: safeUser,
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  // Verify refresh token and rotate
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access denied');

    const isValid = await argon2.verify(user.refreshToken, refreshToken);
    if (!isValid) throw new ForbiddenException('Invalid refresh token');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { success: true };
  }

  // generate access + refresh tokens
  private async getTokens(userId: string, email: string, role: string) {
    const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');

    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT secrets not configured');
    }

    const payload = { sub: userId, email, role };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: accessSecret,
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m',
    });

    const refreshToken = await this.jwt.signAsync(
      { sub: userId },
      {
        secret: refreshSecret,
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  // store hashed refresh token
  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashed = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }
}

// /* eslint-disable @typescript-eslint/no-unsafe-return */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { AuthDto } from './dto';
// import * as argon from 'argon2';
// import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly jwt: JwtService,
//     private readonly config: ConfigService,
//   ) {}

//   private async validateUser(email: string, passpord: string) {
//     const user = await this.prisma.user.findUnique({ where: { email } });
//     if (!user) return null;
//     const isPasswordValid = await argon.verify(user.hash, passpord);
//     if (isPasswordValid) {
//       const { hash, ...result } = user;
//       return result;
//     }
//     return null;
//   }

//   async signToken(
//     userId: string,
//     email: string,
//   ): Promise<{ access_token: string }> {
//     const payload = { sub: userId, email };
//     const secret = this.config.get('JWT_SECRET') || 'vishal';

//     const token = await this.jwt.signAsync(payload, {
//       expiresIn: '1d',
//       secret: secret,
//     });

//     return {
//       access_token: token,
//     };
//   }

//   async signup(dto: AuthDto) {
//     try {
//       // 1. Hash the password
//       const hash = await argon.hash(dto.password);
//       // console.log('Hashed password:', hash);

//       // 2. Save the new user in the database
//       const newUser = await this.prisma.user.create({
//         data: {
//           email: dto.email,
//           firstName: dto.name,
//           hash: hash,
//         },
//         select: {
//           id: true,
//           email: true,
//           firstName: true,
//           createdAt: true,
//           updatedAt: true,
//         },
//       });

//       console.log('Created user:', newUser);

//       return this.signToken(newUser.id, newUser.email);
//     } catch (error) {
//       if (error instanceof PrismaClientKnownRequestError) {
//         if (error.code === 'P2002') {
//           throw new Error('Email already exists');
//         }
//       }
//       console.log('Error in signup service:', error);
//       throw error; // Re-throw the error after logging it
//     }
//   }

//   async signin(dto: AuthDto) {
//     try {
//       // steo 1: find user by email
//       const existingUser = await this.prisma.user.findFirst({
//         where: { email: dto.email },
//       });
//       if (!existingUser) {
//         throw new Error('User not found');
//       }

//       // step 2: compare password, if not match throw exception
//       const pwMatches = await argon.verify(existingUser.hash, dto.password);
//       // step 3: if password match, send back user

//       if (!pwMatches) {
//         throw new Error('Invalid password');
//       }
//       console.log('Signed in user:', existingUser);
//       // existingUser.password = undefined;
//       // return existingUser;
//       return this.signToken(
//         existingUser.id,
//         existingUser.email,
//       ); /* Return JWT token instead of user object */
//     } catch (error) {
//       console.log('Error in signin service:', error);
//       throw error;
//     }
//   }

//   // async refresh(refreshToken: string) {
//   //   try {
//   //     const decoded = this.jwt.verify(refreshToken, {
//   //       secret: this.config.get<string>('JWT_REFRESH_SECRET'),
//   //     });

//   //     const userId = decoded.sub;
//   //     const user = await this.prisma.user.findUnique({ where: { id: userId } });
//   //     if (!user || !user.refreshToken) throw new UnauthorizedException();

//   //     const matches = await bcrypt.compare(refreshToken, user.refreshToken);
//   //     if (!matches) throw new UnauthorizedException();

//   //     // issue new access token
//   //     const payload = { sub: user.id, login: user.login, role: user.role };
//   //     const accessToken = this.jwt.sign(payload, {
//   //       secret: this.config.get<string>('JWT_ACCESS_SECRET'),
//   //       expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m',
//   //     });

//   //     // optionally rotate refresh token:
//   //     const newRefresh = this.jwt.sign(
//   //       { sub: user.id },
//   //       {
//   //         secret: this.config.get<string>('JWT_REFRESH_SECRET'),
//   //         expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
//   //       },
//   //     );
//   //     const hashed = await bcrypt.hash(newRefresh, 10);
//   //     await this.prisma.user.update({
//   //       where: { id: user.id },
//   //       data: { refreshToken: hashed },
//   //     });

//   //     return { accessToken, refreshToken: newRefresh };
//   //   } catch (err) {
//   //     throw new UnauthorizedException('Invalid refresh token');
//   //   }
//   // }
// }
