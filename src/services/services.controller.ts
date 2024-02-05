import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
import { CreateServiceDto, UpdateServiceDto } from 'src/dto/services.dto';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly serviceService: ServicesService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createService(
    @Body() createServiceDto: CreateServiceDto,
    @Req() req: any,
    @Res() res: any,
  ) {
    const userId = req.user.userId;
    const userType = req.user.userType;

    if (userType !== 'provider') {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message:
          'User does not have the required userType for service creation',
      });
    }

    try {
      const createdService = await this.serviceService.createService(
        createServiceDto,
        userId,
      );
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Service created successfully',
        data: createdService,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to create service',
        error: error.message,
      });
    }
  }
  @Get('all')
  async getAllServices(@Res() res) {
    try {
      const services = await this.serviceService.getAllServices();
      res.status(HttpStatus.OK).json({ success: true, services });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.getStatus()).json({
          success: false,
          message: error.message,
        });
      } else {
        console.error('Unhandled error in getAllServices:', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  }
  @Get('id')
  @UseGuards(JwtAuthGuard)
  async getServiceById(@Body() requestBody: { id: string }, @Res() res) {
    const { id } = requestBody;

    try {
      const service = await this.serviceService.getServiceById(id);
      if (!service) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Service not found',
        });
      }
      res.status(HttpStatus.OK).json({ success: true, service });
    } catch (error) {
      console.error('Error in getServiceById:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
  @Put('update')
  @UseGuards(JwtAuthGuard)
  async updateServiceById(
    @Body() requestBody: { id: string; updateServiceDto: UpdateServiceDto },
    @Res() res,
  ) {
    const { id, updateServiceDto } = requestBody;

    try {
      if (!id || !updateServiceDto) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Invalid request body',
        });
      }

      const updatedService = await this.serviceService.updateServiceById(
        id,
        updateServiceDto,
      );

      if (!updatedService) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Service not found',
        });
      }

      res.status(HttpStatus.OK).json({ success: true, updatedService });
    } catch (error) {
      console.error('Error updating service:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteServiceById(@Body() requestBody: { id: string }) {
    try {
      const { id } = requestBody;
      if (!id) {
        throw new HttpException('Invalid request body', HttpStatus.BAD_REQUEST);
      }
      await this.serviceService.deleteServiceById(id);
      return { success: true, message: 'Service deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
