import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersV1Controller } from './v1/orders-v1.controller';
import { OrdersV2Controller } from './v2/orders-v2.controller';
import { OrdersServiceV1 } from './services/orders-v1.service';
import { OrdersServiceV2 } from './services/orders-v2.service';
import { OrderRepository } from './repositories/order.repository';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
  controllers: [OrdersV1Controller, OrdersV2Controller],
  providers: [OrdersServiceV1, OrdersServiceV2, OrderRepository],
})
export class OrdersModule { }
