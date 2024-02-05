// src/city/dto/city.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCityDto {
  @IsNotEmpty()
  @IsString()
  readonly cityName: string;

  @IsNotEmpty()
  @IsString()
  readonly countryId: string;
  @IsNotEmpty()
  @IsString()
  readonly stateId: string;
  // You can add other properties as needed
}

export class UpdateCityDto {
  @IsString()
  readonly cityName?: string;
  // You can add other properties as needed
}
