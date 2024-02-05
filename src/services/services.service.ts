import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServiceDto, UpdateServiceDto } from 'src/dto/services.dto';
import { Service } from 'src/schemas/services.schema';
import { Shop } from 'src/schemas/shop.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Shop.name) private readonly shopModel: Model<Shop>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async createService(createServiceDto: CreateServiceDto, userId: string) {
    // Find the shop and user based on the userId
    const shop = await this.shopModel.findOne({ user: userId }).exec();
    const user = await this.userModel.findById(userId).exec();

    if (!shop || !user) {
      throw new NotFoundException('Shop or User not found');
    }

    // Create the service
    const createdService = await this.serviceModel.create({
      ...createServiceDto,
      shop: shop._id, // Assign the shop ID to the service
      provider: shop.provider, // Assign the provider ID to the service
      user: user._id,
    });

    return createdService;
  }
  async getAllServices(): Promise<{ success: true; services: Service[] }> {
    try {
      const services = await this.serviceModel.find().exec();
      return { success: true, services };
    } catch (error) {
      console.error('Error fetching services:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getServiceById(id: string): Promise<Service | null> {
    try {
      const service = await this.serviceModel.findById(id).exec();
      return service;
    } catch (error) {
      console.error('Error fetching service by ID:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateServiceById(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    try {
      // Find the existing service by ID
      const existingService = await this.serviceModel.findById(id).exec();
      if (!existingService) {
        throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
      }

      // Update only the specified fields
      if (updateServiceDto.serviceName) {
        existingService.serviceName = updateServiceDto.serviceName;
      }
      if (updateServiceDto.servicePrice) {
        existingService.servicePrice = updateServiceDto.servicePrice;
      }
      // Add similar checks for other fields

      // Save the updated service
      const updatedService = await existingService.save();
      return updatedService;
    } catch (error) {
      console.error('Error updating service:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async deleteServiceById(id: string): Promise<void> {
    const deletedService = await this.serviceModel.findByIdAndDelete(id).exec();
    if (!deletedService) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }
  }
}
