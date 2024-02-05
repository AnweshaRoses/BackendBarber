// shop.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Provider } from './provider.schema';
import { User } from './user.schema';

// Regular expression to validate 24-hour time format
const timeRegex = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/;

@Schema()
export class Shop extends Document {
  @Prop({ required: true })
  shopName: string;

  @Prop({ required: true })
  ownerName: string;

  @Prop({
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    required: true,
  })
  openingDay: string;

  @Prop({
    type: String,
    required: true,
    validate: {
      validator: (value: string) => timeRegex.test(value),
      message: (props) => `${props.value} is not a valid 24-hour time format`,
    },
  })
  openingTime: string;

  @Prop({
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    required: true,
  })
  closingDay: string;

  @Prop({
    type: String,
    required: true,
    validate: {
      validator: (value: string) => timeRegex.test(value),
      message: (props) => `${props.value} is not a valid 24-hour time format`,
    },
  })
  closingTime: string;

  @Prop()
  shopImg: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Provider.name,
    required: true,
  })
  provider: Provider;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: User;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
