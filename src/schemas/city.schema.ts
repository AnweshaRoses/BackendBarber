import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Country } from './country.schema';
import { State } from './state.schema';
@Schema()
export class City extends Document {
  @Prop({ required: true })
  cityName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Country.name })
  countryId: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: State.name })
  stateId: string;
}

export const CitySchema = SchemaFactory.createForClass(City);
