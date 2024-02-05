// src/city/dto/city.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStateDto {
  @IsNotEmpty()
  @IsString()
  readonly stateName: string;

  @IsNotEmpty()
  @IsString()
  readonly countryId: string;
  // You can add other properties as needed
}

export class UpdateStateDto {
  @IsString()
  readonly stateName?: string;
  // You can add other properties as needed
}
