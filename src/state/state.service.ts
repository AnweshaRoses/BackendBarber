import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { State } from 'src/schemas/state.schema';
import { CreateStateDto, UpdateStateDto } from 'src/dto/state.dto';

@Injectable()
export class StateService {
  constructor(@InjectModel(State.name) private stateModel: Model<State>) {}

  async create(createStateDto: CreateStateDto): Promise<State> {
    const createdCity = new this.stateModel(createStateDto);
    return createdCity.save();
  }
  async findAll(): Promise<State[]> {
    return this.stateModel.find().exec();
  }

  async findById(id: string): Promise<State> {
    return this.stateModel.findById(id).exec();
  }

  async update(id: string, updateStateDto: UpdateStateDto): Promise<State> {
    return this.stateModel
      .findByIdAndUpdate(id, updateStateDto, { new: true })
      .exec();
  }

  async deleteById(id: string): Promise<{ message: string }> {
    const existingCity = await this.stateModel.findByIdAndDelete(id);

    if (!existingCity) {
      throw new NotFoundException('State not found');
    }

    return { message: 'State has been deleted' };
  }
}
