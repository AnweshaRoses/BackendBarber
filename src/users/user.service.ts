import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose'; // Import the Model type from mongoose
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from '../dto/signup.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import * as jwt from 'jsonwebtoken';
import { validate } from 'class-validator';
import { Consumer } from 'src/schemas/consumer.schema';
@Injectable()
//Making user class and constructor
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Consumer.name) private consumerModel: Model<Consumer>,
  ) {}

  //Register a new user and password is hashed
  // userService.ts

  // ...

  async register(signUpDto: SignUpDto): Promise<{
    message: string;
    success: boolean;
    user?: User;
    token?: string;
    statusCode?: number;
  }> {
    try {
      const validationErrors = await validate(signUpDto);

      if (validationErrors.length > 0) {
        const errorMessage = validationErrors
          .map((error) => Object.values(error.constraints).join(', '))
          .join(', ');

        throw new HttpException(
          { message: errorMessage, success: false },
          HttpStatus.BAD_REQUEST,
        );
      }

      const { name, email, password, userType } = signUpDto;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        userType,
      });

      const token = this.generateToken(user);

      return {
        message: 'User created successfully',
        success: true,
        user,
        token,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        // Handle validation error differently
        return {
          message: error.message,
          success: false,
          user: undefined,
          token: undefined,
          statusCode: error.getStatus(),
        };
      } else {
        // Handle other unexpected errors
        return {
          message: 'Failed to register user',
          success: false,
          user: undefined,
          token: undefined,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  }

  // ...

  generateToken(user: User): string {
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h', // You can adjust the token expiration time as needed
      },
    );
    return token;
  }

  /* 

Making user CRUD Operations

*/
  //Get all the users
  async findAll(): Promise<{ success: boolean; user: User[] }> {
    const user = await this.userModel.find();
    return { success: true, user };
  }

  //Fetch Unique user by id
  async findbyId(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        console.log(`User with ID ${id} not found.`);
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      // Log the error for further investigation
      console.error('Error in findbyId:', error);
      throw error; // Rethrow the error
    }
  }

  //Update user by id
  async updateById(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Find the user by ID
    const existingUser = await this.userModel.findById(id);

    // If user not found, throw NotFoundException
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    Object.assign(existingUser, updateUserDto);

    // Save the updated user
    const updatedUserData = await existingUser.save();

    return updatedUserData;
  }

  async deleteById(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    // Find the user by ID
    const existingUser = await this.userModel.findById(id);

    // If user not found, throw NotFoundException
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    await this.consumerModel.deleteOne({ user: existingUser._id });
    // Delete the user
    await this.userModel.deleteOne({ _id: id });

    return { success: true, message: 'User has been deleted' };
  }
}
