import {
  IsNotEmpty,
  IsString,
  Matches,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
  IsOptional,
  ValidationArguments,
} from 'class-validator';
// import { PartialType } from '@nestjs/mapped-types';

// Regular expression to validate 24-hour time format
const timeRangeRegex =
  /^(?:2[0-3]|[01][0-9]):[0-5][0-9]-(?:2[0-3]|[01][0-9]):[0-5][0-9]$/;
const dateFormatRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
@ValidatorConstraint({ name: 'IsAfterOrCurrentDate', async: false })
export class IsAfterOrCurrentDateConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any) {
    const currentDate = new Date();
    const selectedDate = new Date(value);
    return selectedDate >= currentDate;
  }

  defaultMessage() {
    return 'Slot date must be the current date or later';
  }
}
@ValidatorConstraint({ name: 'IsAfterOrCurrentDateForUpdate', async: false })
export class IsAfterOrCurrentDateForUpdateConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any) {
    const currentDate = new Date();
    const selectedDate = new Date(value);
    return selectedDate >= currentDate;
  }

  defaultMessage(args: ValidationArguments) {
    return `The ${args.property} must be the current date or later`;
  }
}

export class CreateSlotDto {
  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @IsNotEmpty()
  @IsString()
  day: string;

  @IsOptional() // Ensure the date is not empty
  @IsString()
  @Matches(dateFormatRegex, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  @Validate(IsAfterOrCurrentDateConstraint, {
    message: 'Slot date must be the current date or later',
  })
  date: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Matches(timeRangeRegex, {
    each: true,
    message: 'Slot timing is not in correct format',
  })
  slotTiming: string[]; // Now expects an array of strings for slot timings
}

export class UpdateSlotDto {
  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsNotEmpty()
  @IsString()
  day: string;

  @IsOptional() // Ensure the date is not empty
  @IsString()
  @Matches(dateFormatRegex, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  @Validate(IsAfterOrCurrentDateForUpdateConstraint, {
    message: 'Slot date must be the current date or later',
  })
  date?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Matches(timeRangeRegex, {
    each: true,
    message: 'Slot timing is not in correct format',
  })
  slotTiming?: string[]; // Now expects an array of strings for slot timings
}
