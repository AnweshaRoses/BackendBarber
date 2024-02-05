import { Controller } from '@nestjs/common';
import { Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CreateStateDto, UpdateStateDto } from 'src/dto/state.dto';
import { StateService } from './state.service';
@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post()
  createCity(@Body() createStateDto: CreateStateDto) {
    return this.stateService.create(createStateDto);
  }
  @Get()
  findAllState() {
    return this.stateService.findAll();
  }
  @Get(':id')
  findStateById(@Param('id') id: string) {
    return this.stateService.findById(id);
  }

  @Put(':id')
  updateState(@Param('id') id: string, @Body() updateStateDto: UpdateStateDto) {
    return this.stateService.update(id, updateStateDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.stateService.deleteById(id);
  }
}
