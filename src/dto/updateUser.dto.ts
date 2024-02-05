// update-user.dto.ts

import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please enter a valid email' })
  readonly email: string;
}
