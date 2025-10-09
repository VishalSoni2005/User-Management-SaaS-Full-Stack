import type { Role } from '@prisma/client';

export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export class UserProfileDto {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
}
