import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  NotFoundException,
  UseGuards,
  Req,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import { SignUpDto } from '../dto/signup.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  //used to register a new user
  @Post('/register')
  async signUp(
    @Body(new ValidationPipe()) signUpDto: SignUpDto,
    @Res() res,
  ): Promise<void> {
    try {
      const response = await this.userService.register(signUpDto);

      if (response.success) {
        res.status(HttpStatus.CREATED).json({
          success: true,
          message: response.message,
          user: response.user,
          token: response.token,
        });
      } else {
        res.status(response.statusCode).json({
          success: false,
          message: response.message,
          user: null,
          token: null,
        });
      }
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.getStatus()).json({
          success: false,
          message: error.message,
          user: null,
          token: null,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Internal Server Error',
          user: null,
          token: null,
        });
      }
    }
  }

  /* 
  CRUD Operations Controllers 
  */

  //Get all users use (/user/all)
  @Get('/all')
  async getAllUsers(@Res() res): Promise<void> {
    try {
      const result = await this.userService.findAll();
      res.status(HttpStatus.OK).json({ success: true, user: result.user });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal Server Error',
        user: null,
      });
    }
  }
  //Get user by id use (/user/:id)
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Req() req): Promise<{ success: boolean; user?: User }> {
    const userId = req.user.userId;

    try {
      // Assuming 'findbyId' method is correctly implemented
      const user = await this.userService.findbyId(userId);

      // Now you can access the user details
      // console.log(user);

      return { success: true, user };
    } catch (error) {
      // Handle the error, for example, log it
      console.error('Error retrieving user profile:', error);

      // Return an appropriate response
      return { success: false, user: undefined };
    }
  }
  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res,
  ): Promise<void> {
    const userId = req.user.userId;

    try {
      const updatedUser = await this.userService.updateById(
        userId,
        updateUserDto,
      );
      res.status(HttpStatus.OK).json({ success: true, user: updatedUser });
    } catch (error) {
      // Handle specific error cases if needed
      if (error instanceof NotFoundException) {
        // Handle NotFoundException, for example:
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'User not found',
        });
      } else {
        console.error('Error updating user:', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Failed to update user',
        });
      }
    }
  }
  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  async deleteUserById(@Req() req, @Res() res): Promise<void> {
    const userId = req.user.userId;

    try {
      await this.userService.deleteById(userId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'User has been deleted',
      });
    } catch (error) {
      // Handle specific error cases if needed
      if (error instanceof NotFoundException) {
        // Handle NotFoundException, for example:
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'User not found',
        });
      }
      // Handle other errors
      console.error('Error deleting user:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to delete user',
      });
    }
  }
}
