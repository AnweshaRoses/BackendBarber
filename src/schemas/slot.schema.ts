// slot.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Shop } from './shop.schema';
import { Service } from './services.schema';

@Schema()
export class Slot extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Service', required: true })
  service: Service;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop', required: true })
  shop: Shop;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Provider',
    required: true,
  })
  provider: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  day: string;

  @Prop()
  date: string;

  @Prop({ type: [String], required: true })
  slotTiming: string[]; // Now an array of strings to store multiple slot timings
}

export const SlotSchema = SchemaFactory.createForClass(Slot);
