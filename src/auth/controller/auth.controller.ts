import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { User, UserType } from '../../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from './jwt-auth.guard';


@Controller('auth')

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/user')
  async create(@Body() user: User): Promise<User> {
    return this.authService.create(user);
  }

  @Post('/login')
async login(
  @Body() credentials: { email: string; password: string },
): Promise<{ success: boolean; token?: string; userType?: UserType; userId?: string; error?: string }> {
  try {
    const user = await this.authService.findByEmail(credentials.email);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await this.authService.verifyPassword(
      user,
      credentials.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = this.authService.generateToken(user);
    const userType = user.userType;
    const userId = user._id.toString(); // Convert ObjectId to string

    return { success: true, token, userType, userId };
  } catch (error) {
    return { success: false, error: 'Authentication failed' };
  }
}



  @Post('/forgot-password')
  async forgotPassword(
    @Body() body: { email: string },
  ): Promise<{ message: string }> {
    const user = await this.authService.findByEmail(body.email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.authService.sendPasswordResetEmail(user);

    return { message: 'password reset link sent successfully' };
  }

  @Post('/reset-password')
  @UseGuards(JwtAuthGuard)
  async resetPassword(
    @Req() req: any, // Inject the Request object
    @Body() body: { newPassword: string },
  ): Promise<{ message: string, newToken?: string }> {
    try {
      
      console.log('Reset Password Request Received');
      console.log('Decoded Token:', req.user);
      console.log('Request Body:', body);

      if (!req.user || !req.user.userId) {
        console.log('Decoded token is missing');
        throw new HttpException(
          'Decoded token is missing',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const userId = req.user.userId; 

      const user = await this.authService.findById(userId);

      if (!user) {
        console.log('User not found');
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const hashedPassword = await bcrypt.hash(body.newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      const newToken = this.authService.generateToken(user);
      console.log(newToken)

      console.log('Password reset successful');
      return { message: 'Password reset successful', newToken };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw error;
    }
  }
}
