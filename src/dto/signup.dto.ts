import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsIn,
  Matches,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W)(?=.*\w).*$/, {
    message:
      'Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character',
  })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['consumer', 'provider'], {
    message: 'Invalid userType. Must be either "consumer" or "provider".',
  })
  readonly userType: string;
}
