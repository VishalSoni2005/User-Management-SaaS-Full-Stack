import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
}
