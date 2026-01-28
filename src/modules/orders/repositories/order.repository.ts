import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '@thesleepcompany/db-wrapper'
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class OrderRepository extends BaseRepository<OrderDocument> {
  constructor(@InjectModel(Order.name) model: Model<OrderDocument>) {
    super(model);
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderDocument | null> {
    return this.findOne({ orderNumber });
  }
}
