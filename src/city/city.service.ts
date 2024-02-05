import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City } from 'src/schemas/city.schema';
import { CreateCityDto, UpdateCityDto } from 'src/dto/city.dto';
@Injectable()
export class CityService {
  constructor(@InjectModel(City.name) private cityModel: Model<City>) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    const createdCity = new this.cityModel(createCityDto);
    return createdCity.save();
  }

  async findAll(): Promise<City[]> {
    return this.cityModel.find().exec();
  }

  async findById(id: string): Promise<City> {
    return this.cityModel.findById(id).exec();
  }

  async update(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    return this.cityModel
      .findByIdAndUpdate(id, updateCityDto, { new: true })
      .exec();
  }

  async deleteById(id: string): Promise<{ message: string }> {
    const existingCity = await this.cityModel.findByIdAndDelete(id);

    if (!existingCity) {
      throw new NotFoundException('City not found');
    }

    return { message: 'City has been deleted' };
  }
}
