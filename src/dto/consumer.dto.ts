// consumer/consumer.dto.ts

import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsOptional,
  IsMongoId,
} from 'class-validator';

export class CreateConsumerDto {
  @IsNotEmpty()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  phoneNo: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsMongoId()
  city: string;

  @IsNotEmpty()
  @IsMongoId()
  state: string;

  @IsNotEmpty()
  @IsMongoId()
  country: string;

  @IsNotEmpty()
  @IsString()
  pin: string;
}
export class UpdateConsumerDto {
  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  phoneNo?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsMongoId() // Validate if it's a MongoDB ObjectId
  city?: string; // Change to accept ObjectId instead of string

  @IsOptional()
  @IsMongoId() // Validate if it's a MongoDB ObjectId
  state?: string; // Change to accept ObjectId instead of string

  @IsOptional()
  @IsMongoId() // Validate if it's a MongoDB ObjectId
  country?: string; // Change to accept ObjectId instead of string

  @IsOptional()
  @IsString()
  pin: string;
}
