// consumer/consumer.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Country } from './country.schema';
import { State } from './state.schema';
import { City } from './city.schema';
import { User } from './user.schema';

@Schema()
export class Consumer extends Document {
  @Prop({ required: true })
  phoneNo: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  image: string;

  @Prop()
  pin: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: City.name })
  city: City;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: State.name })
  state: State;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Country.name })
  country: Country;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  user: User;
}

export const ConsumerSchema = SchemaFactory.createForClass(Consumer).set(
  'toJSON',
  {
    transform: (doc, ret) => {
      if (ret.user) {
        delete ret.user.password;
        ret.user = ret.user._id;
      }
      return ret;
    },
  },
);
