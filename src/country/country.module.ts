import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { Country, CountrySchema } from 'src/schemas/country.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
  ],
  providers: [CountryService],
  controllers: [CountryController],
})
export class CountryModule {}
