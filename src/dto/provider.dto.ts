import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
} from 'class-validator';

export class CreateProviderDto {
  @IsNotEmpty()
  @IsPhoneNumber(undefined || null, {
    message: 'Primary phone number is invalid',
  })
  primaryPhoneNumber: string;

  @IsOptional()
  @IsPhoneNumber(undefined || null, {
    message: 'Secondary phone number is invalid',
  })
  secondaryPhoneNumber?: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsPostalCode('any', { message: 'Pincode is invalid' })
  pincode: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  country: string;
  profileImage: any;
}

// update-provider.dto.ts

export class UpdateProviderDto {
  @IsOptional()
  @IsPhoneNumber(undefined || null, {
    message: 'Secondary phone number is invalid',
  })
  secondaryPhoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsPostalCode('any', { message: 'Pincode is invalid' })
  pincode?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  profileImage?: any;
}
