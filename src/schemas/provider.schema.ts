import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Country } from './country.schema';
import { State } from './state.schema';
import { City } from './city.schema';
import { User } from './user.schema';

@Schema()
export class Provider extends Document {
  static userType() // userType: any,
  : (
    target: typeof import('../provider/provider.service').ProviderService,
    propertyKey: undefined,
    parameterIndex: 4,
  ) => void {
    throw new Error('Method not implemented.');
  }

  @Prop({ required: true, match: /^\+?[0-9]*$/ })
  primaryPhoneNumber: string;

  // Remove secondaryPhoneNumber property
  @Prop({ match: /^\+?[0-9]*$/ })
  secondaryPhoneNumber: string;

  @Prop({ required: true })
  address?: string; // Make it optional

  @Prop({ required: true, match: /^[0-9]{6}$/ })
  pincode?: string; // Make it optional

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: City.name })
  city?: City; // Make it optional

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: State.name })
  state?: State; // Make it optional

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Country.name })
  country?: Country; // Make it optional

  @Prop()
  profileImage?: string; // Make it optional

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  user: User;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider).set(
  'toJSON',
  {
    transform: (doc, ret) => {
      delete ret.user.password;
      ret.user = ret.user._id;
      return ret;
    },
  },
);
