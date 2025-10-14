import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'LHd0K@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  @IsString()
  @MinLength(3)
  password!: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'Vishal',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Kumar',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'ADMIN',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
