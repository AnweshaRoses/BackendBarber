import {
  Controller,
  Body,
  Post,
  NotFoundException,
  Get,
  Patch,
  Delete,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { CreateConsumerDto, UpdateConsumerDto } from 'src/dto/consumer.dto';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';

@Controller('consumer')
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createConsumer(
    @Body() createConsumerDto: CreateConsumerDto,
    @Req() req,
    @Res() res,
  ) {
    const userId = req.user.user || req.user.userId;
    const userType = req.user.userType;

    if (userType !== 'consumer') {
      throw new NotFoundException(
        'User does not have the required userType of consumer',
      );
    }

    try {
      const consumer = await this.consumerService.create(
        createConsumerDto,
        userId,
      );
      res.status(201).json({
        success: true,
        message: 'Consumer created successfully',
        consumer,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof HttpException) {
        res.status(error.getStatus()).json({
          success: false,
          message: error.message,
        });
      } else {
        if (
          error.message.includes('Consumer details already exist for this user')
        ) {
          res.status(400).json({
            success: false,
            message: 'Consumer details already exist for this user',
          });
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to create consumer',
          });
        }
      }
    }
  }
  @Get('all')
  async getAllConsumers(@Res() res) {
    try {
      const consumers = await this.consumerService.getAllConsumers();
      res.status(200).json({ success: true, consumers });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.getStatus()).json({
          success: false,
          message: error.message,
        });
      } else {
        console.error('Unhandled error in getAllConsumers:', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getConsumerProfile(@Req() req, @Res() res) {
    const userId = req.user.userId;
    const userType = req.user.userType;

    if (userType !== 'consumer') {
      throw new NotFoundException(
        'User does not have the required userType of consumer',
      );
    }

    try {
      const consumer = await this.consumerService.getConsumerById(userId);
      res.status(200).json({ success: true, consumer });
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to get consumer profile',
        });
      }
    }
  }
  @Patch('update')
  @UseGuards(JwtAuthGuard)
  async updateConsumerProfile(
    @Body() updateConsumerDto: UpdateConsumerDto,
    @Req() req,
    @Res() res,
  ) {
    const userId = req.user.userId;
    const userType = req.user.userType;

    if (userType !== 'consumer') {
      res.status(403).json({
        success: false,
        message: 'User does not have the required userType of consumer',
      });
      return;
    }

    try {
      const updatedConsumer = await this.consumerService.updateConsumer(
        userId,
        updateConsumerDto,
      );
      res.status(200).json({ success: true, consumer: updatedConsumer });
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        console.error('Error updating consumer profile:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to update consumer profile',
        });
      }
    }
  }
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteConsumerProfile(@Req() req, @Res() res): Promise<void> {
    const userId = req.user.userId;
    const userType = req.user.userType;

    if (userType !== 'consumer') {
      throw new NotFoundException(
        'User does not have the required userType of consumer',
      );
    }

    try {
      await this.consumerService.deleteConsumer(userId);
      res
        .status(200)
        .json({ success: true, message: 'Consumer has been deleted' });
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Failed to delete consumer profile',
        });
      }
    }
  }
}
