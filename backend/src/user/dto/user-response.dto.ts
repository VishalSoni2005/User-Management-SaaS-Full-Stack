import { ApiProperty } from '@nestjs/swagger';
import type { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '66f3e91e2a9e8b4f124f03d2',
  })
  id: string;

  @ApiProperty({
    description: 'Email address of the user (used for login and contact)',
    example: 'vishal@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'Vishal',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user (optional)',
    example: 'Soni',
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    description: 'Role assigned to the user',
    enum: ['USER', 'ADMIN'],
    example: 'USER',
  })
  role: Role;

  @ApiProperty({
    description: 'Timestamp when the user was created',
    example: '2025-10-11T10:12:45.123Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the user was last updated',
    example: '2025-10-11T11:30:02.345Z',
  })
  updatedAt: Date;
}

export class UserProfileDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '66f3e91e2a9e8b4f124f03d2',
  })
  id: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'Vishal',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user (optional)',
    example: 'Soni',
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'vishal@example.com',
  })
  email: string;
}
