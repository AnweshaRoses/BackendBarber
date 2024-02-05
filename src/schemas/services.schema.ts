// service.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Shop } from './shop.schema';

@Schema()
export class Service extends Document {
  @Prop({ required: true })
  serviceName: string;

  @Prop({ required: true })
  servicePrice: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Shop.name, required: true })
  shop: Shop;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Provider',
    required: true,
  })
  provider: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
