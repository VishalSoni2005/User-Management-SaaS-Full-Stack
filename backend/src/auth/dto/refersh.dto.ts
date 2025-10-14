import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token of the user',
    example: 'refreshToken',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
