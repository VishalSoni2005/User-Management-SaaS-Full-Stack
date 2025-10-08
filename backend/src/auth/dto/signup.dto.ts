// import {
//   IsEmail,
//   IsNotEmpty,
//   IsString,
//   IsStrongPassword,
//   MinLength,
// } from 'class-validator';

// export class AuthDto {
//   @IsString()
//   @MinLength(3)
//   firstName: string;

//   @IsString()
//   @MinLength(3)
//   lastName: string;

//   @IsEmail()
//   @IsNotEmpty()
//   email: string;

//   @IsStrongPassword()
//   @IsNotEmpty()
//   @IsString()
//   password: string;

//   @IsString()
//   @IsNotEmpty()
//   role: string;
// }
// interface is implemented
import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Signup {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: Role;
}
