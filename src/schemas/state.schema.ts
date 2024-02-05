import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Country } from './country.schema';

@Schema()
export class State extends Document {
  @Prop({ required: true })
  stateName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Country.name })
  countryId: string;
}

export const StateSchema = SchemaFactory.createForClass(State);
