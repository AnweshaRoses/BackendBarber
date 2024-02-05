// provider.service.ts

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProviderDto, UpdateProviderDto } from 'src/dto/provider.dto';
import { City } from 'src/schemas/city.schema';
import { Country } from 'src/schemas/country.schema';
import { Provider } from 'src/schemas/provider.schema';
import { State } from 'src/schemas/state.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class ProviderService {
  // cityModel: any;
  // stateModel: any;
  // countryModel: any;
  constructor(
    @InjectModel(Provider.name) private readonly providerModel: Model<Provider>,
    @InjectModel(City.name) private readonly cityModel: Model<City>,
    @InjectModel(State.name) private readonly stateModel: Model<State>,
    @InjectModel(Country.name) private readonly countryModel: Model<Country>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createProvider(
    createProviderDto: CreateProviderDto,
    userId: string,
  ): Promise<Provider> {
    // Check if the user exists and has the userType 'provider'
    const user = await this.userModel.findById(userId).exec();

    if (!user || user.userType !== 'provider') {
      throw new UnauthorizedException(
        'User does not have the required userType for provider creation',
      );
    }

    // Validate and get the city, state, and country
    const city = await this.cityModel.findOne({
      cityName: createProviderDto.city,
    });

    const state = await this.stateModel.findOne({
      stateName: createProviderDto.state,
    });

    const country = await this.countryModel.findOne({
      countryName: createProviderDto.country,
    });

    if (!city || !state || !country) {
      throw new NotFoundException('Invalid city, state, or country');
    }

    // Save provider information to the database
    const createdProvider = new this.providerModel(createProviderDto);
    createdProvider.city = city;
    createdProvider.state = state;
    createdProvider.country = country;
    createdProvider.user = user;

    return createdProvider.save();
  }

  async getAllProviders(): Promise<Provider[]> {
    return this.providerModel.find().exec();
  }

  async getUserType(userId: string): Promise<string | null> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.userType;
  }

  async getProviderByUserId(userId: string): Promise<Provider | null> {
    // Check if the user with the provided userId is a provider
    const userType = await this.getUserType(userId);

    if (userType !== 'provider') {
      throw new UnauthorizedException(
        'User does not have the required userType for accessing provider information',
      );
    }

    const provider = await this.providerModel.findOne({ user: userId }).exec();

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }

  async updateProvider(
    updateProviderDto: UpdateProviderDto,
    userId: string,
  ): Promise<Provider> {
    // Check if the user with the provided userId is a provider
    const userType = await this.getUserType(userId);

    if (userType !== 'provider') {
      throw new UnauthorizedException(
        'User does not have the required userType for updating provider information',
      );
    }

    const existingProvider = await this.providerModel
      .findOne({ user: userId })
      .exec();

    if (!existingProvider) {
      throw new NotFoundException('Provider not found');
    }

    // Update fields based on the updateProviderDto
    Object.assign(existingProvider, updateProviderDto);

    return existingProvider.save();
  }

  async deleteProvider(userId: string): Promise<Provider | null> {
    try {
      const deletedProvider = await this.providerModel
        .findOneAndDelete({ user: userId })
        .exec();

      if (!deletedProvider) {
        throw new NotFoundException('Provider not found');
      }

      return deletedProvider;
    } catch (error) {
      // Log the error or handle it accordingly
      throw new Error(`Failed to delete provider: ${error.message}`);
    }
  }
}
