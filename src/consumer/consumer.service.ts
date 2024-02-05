import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Consumer } from 'src/schemas/consumer.schema';
import { CreateConsumerDto, UpdateConsumerDto } from 'src/dto/consumer.dto';
import { City } from 'src/schemas/city.schema';
import { State } from 'src/schemas/state.schema';
import { Country } from 'src/schemas/country.schema';
import { User } from 'src/schemas/user.schema';
@Injectable()
export class ConsumerService {
  constructor(
    @InjectModel(Consumer.name) private consumerModel: Model<Consumer>,
    @InjectModel(City.name) private cityModel: Model<City>,
    @InjectModel(State.name) private stateModel: Model<State>,
    @InjectModel(Country.name) private countryModel: Model<Country>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async create(
    createConsumerDto: CreateConsumerDto,
    userId: string,
  ): Promise<{ success: true; consumer: Consumer }> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }
    const existingConsumer = await this.consumerModel.findOne({ user: userId });

    if (existingConsumer) {
      throw new HttpException(
        'Consumer details already exist for this user',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate and get the city, state, and country by ID
    const city = await this.cityModel.findById(createConsumerDto.city);
    const state = await this.stateModel.findById(createConsumerDto.state);
    const country = await this.countryModel.findById(createConsumerDto.country);

    if (!city || !state || !country) {
      throw new HttpException(
        'Invalid city, state, or country',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Save consumer information to the database
    const consumer = new this.consumerModel(createConsumerDto);
    consumer.city = city;
    consumer.state = state;
    consumer.country = country;
    consumer.user = user;
    const savedConsumer = await consumer.save();
    return { success: true, consumer: savedConsumer };
  }
  async getAllConsumers(): Promise<{ success: true; consumers: Consumer[] }> {
    try {
      const consumers = await this.consumerModel.find().populate('user').exec();
      return { success: true, consumers };
    } catch (error) {
      console.error('Error fetching consumers:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getConsumerById(
    userId: string,
  ): Promise<{ success: true; consumer: Consumer }> {
    const consumer = await this.consumerModel
      .findOne({ user: userId })
      .populate('user')
      .exec();

    if (!consumer) {
      throw new NotFoundException('Consumer not found');
    }

    return { success: true, consumer };
  }
  //update Consumer
  async updateConsumer(
    userId: string,
    updateConsumerDto: UpdateConsumerDto,
  ): Promise<{ success: true; consumer: Consumer }> {
    const existingConsumer = await this.consumerModel
      .findOne({ user: userId })
      .populate('user')
      .exec();

    if (!existingConsumer) {
      throw new NotFoundException('Consumer not found');
    }

    // Update only the fields that are present in the request body
    if (updateConsumerDto.phoneNo) {
      existingConsumer.phoneNo = updateConsumerDto.phoneNo;
    }

    if (updateConsumerDto.address) {
      existingConsumer.address = updateConsumerDto.address;
    }

    if (updateConsumerDto.image) {
      existingConsumer.image = updateConsumerDto.image;
    }

    // Update city, state, country if present in the request body
    if (updateConsumerDto.city) {
      const city = await this.cityModel.findById(updateConsumerDto.city);
      if (!city) {
        throw new Error('Invalid city');
      }
      existingConsumer.city = city;
    }

    if (updateConsumerDto.state) {
      const state = await this.stateModel.findById(updateConsumerDto.state);
      if (!state) {
        throw new Error('Invalid state');
      }
      existingConsumer.state = state;
    }

    if (updateConsumerDto.country) {
      const country = await this.countryModel.findById(
        updateConsumerDto.country,
      );
      if (!country) {
        throw new Error('Invalid country');
      }
      existingConsumer.country = country;
    }

    // Save the updated consumer
    const updatedConsumer = await existingConsumer.save();
    return { success: true, consumer: updatedConsumer };
  }

  async deleteConsumer(
    userId: string,
  ): Promise<{ success: true; message: string }> {
    const existingConsumer = await this.consumerModel
      .findOneAndDelete({ user: userId }) // Use findOneAndDelete to find and delete the consumer
      .populate('user')
      .exec();

    if (!existingConsumer) {
      throw new NotFoundException('Consumer not found');
    }

    return { success: true, message: 'Consumer has been deleted' };
  }
}
