// src/city/dto/city.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryDto {
  @IsNotEmpty()
  @IsString()
  readonly countryName: string;
}

export class UpdateCountryDto {
  @IsString()
  readonly countryName?: string;
  // You can add other properties as needed
}
