import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@thesleepcompany/db-wrapper';

// Sample Order Schema
@Schema({ timestamps: true })
export class Order extends BaseSchema {
  @Prop({ required: true })
  orderNumber: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ default: 'PENDING' })
  status: string;

  @Prop({ type: Number, required: true })
  totalAmount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
