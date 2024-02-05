// shop.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  Matches,
  IsOptional,
} from 'class-validator';

// Regular expression to validate 24-hour time format
const timeRegex = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/;

export class CreateShopDto {
  @IsNotEmpty()
  @IsString()
  shopName: string;

  @IsNotEmpty()
  @IsString()
  ownerName: string;

  @IsNotEmpty()
  @IsEnum([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ])
  openingDay: string;

  @IsNotEmpty()
  @Matches(timeRegex, { message: 'Opening time must be in 24-hour format' })
  openingTime: string;

  @IsNotEmpty()
  @IsEnum([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ])
  closingDay: string;

  @IsNotEmpty()
  @Matches(timeRegex, { message: 'Opening time must be in 24-hour format' })
  closingTime: string;

  @IsString()
  shopImg: string;

  @IsString()
  @IsOptional()
  provider: string;

  @IsString()
  @IsOptional()
  user: string;
}

export class UpdateShopDto {
  @IsString()
  @IsOptional()
  shopName?: string;

  @IsString()
  @IsOptional()
  ownerName?: string;

  @IsEnum([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ])
  @IsOptional()
  openingDay?: string;

  @Matches(timeRegex, { message: 'Opening time must be in 24-hour format' })
  @IsOptional()
  openingTime?: string;

  @IsEnum([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ])
  @IsOptional()
  closingDay?: string;

  @Matches(timeRegex, { message: 'Opening time must be in 24-hour format' })
  @IsOptional()
  closingTime?: string;

  @IsString()
  @IsOptional()
  shopImg?: string;
}
