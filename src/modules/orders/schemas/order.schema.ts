import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema, IBaseDocument } from '@thesleepcompany/db-wrapper';

export type OrderDocument = Order & Document & IBaseDocument;

@Schema({ timestamps: true, id: true, toJSON: { virtuals: true } })
export class Order extends BaseSchema {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 'PENDING' })
  status: string;

  @Prop()
  deliveryType?: string; // v2 field

  @Prop()
  estimatedDeliveryDate?: Date; // v2 field derived
}

export const OrderSchema = SchemaFactory.createForClass(Order);
