import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'Vishal',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Kumar',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'LHd0K@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'ADMIN',
    required: false,
  })
  @IsOptional()
  @IsString()
  role?: Role;
}
