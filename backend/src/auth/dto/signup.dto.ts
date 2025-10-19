import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Signup {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'Vishal',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Kumar',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'LHd0K@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The role of the user => [ADMIN, USER]',
    example: 'ADMIN',
  })
  @IsString()
  role: Role;
  @ApiProperty({
    description: 'Optional avatar URL',
    example: 'https://api.dicebear.com/9.x/avataaars/svg?seed=vishal',
  })
  @IsString()
  @IsOptional()
  avatar?: string;
}
