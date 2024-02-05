import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from 'src/schemas/country.schema';
import { CreateCountryDto, UpdateCountryDto } from 'src/dto/country.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    const createdCountry = new this.countryModel(createCountryDto);
    return createdCountry.save();
  }
  async findAll(): Promise<Country[]> {
    return this.countryModel.find().exec();
  }
  async findById(id: string): Promise<Country> {
    return this.countryModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    return this.countryModel
      .findByIdAndUpdate(id, updateCountryDto, { new: true })
      .exec();
  }

  async deleteById(id: string): Promise<{ message: string }> {
    const existingCountry = await this.countryModel.findByIdAndDelete(id);

    if (!existingCountry) {
      throw new NotFoundException('Country not found');
    }

    return { message: 'Country has been deleted' };
  }
}
