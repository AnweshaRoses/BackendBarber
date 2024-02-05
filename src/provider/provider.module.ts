// provider.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { Provider, ProviderSchema } from 'src/schemas/provider.schema';
import { City, CitySchema } from 'src/schemas/city.schema';
import { State, StateSchema } from 'src/schemas/state.schema';
import { Country, CountrySchema } from 'src/schemas/country.schema';
import { User, UserSchema } from 'src/schemas/user.schema'; // Import User and its schema
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Provider.name, schema: ProviderSchema },
      { name: City.name, schema: CitySchema },
      { name: State.name, schema: StateSchema },
      { name: Country.name, schema: CountrySchema },
      { name: User.name, schema: UserSchema }, // Add User model and schema
    ]),
    AuthModule,
  ],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule {}
