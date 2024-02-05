import { Controller } from '@nestjs/common';
import { Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CreateCityDto, UpdateCityDto } from 'src/dto/city.dto';
import { CityService } from './city.service';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  createCity(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get()
  findAllCities() {
    return this.cityService.findAll();
  }

  @Get(':id')
  findCityById(@Param('id') id: string) {
    return this.cityService.findById(id);
  }

  @Put(':id')
  updateCity(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(id, updateCityDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.cityService.deleteById(id);
  }
}
