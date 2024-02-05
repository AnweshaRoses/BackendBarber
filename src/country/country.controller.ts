import { Controller } from '@nestjs/common';
import { Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CreateCountryDto, UpdateCountryDto } from 'src/dto/country.dto';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  createCountry(@Body() createCountryDtyo: CreateCountryDto) {
    return this.countryService.create(createCountryDtyo);
  }

  @Get()
  findAllCountry() {
    return this.countryService.findAll();
  }

  @Get(':id')
  findCountryById(@Param('id') id: string) {
    return this.countryService.findById(id);
  }

  @Put(':id')
  updateCountry(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return this.countryService.update(id, updateCountryDto);
  }

  @Delete(':id')
  async deleteCountry(@Param('id') id: string): Promise<{ message: string }> {
    return this.countryService.deleteById(id);
  }
}
