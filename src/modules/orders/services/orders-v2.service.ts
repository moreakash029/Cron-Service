import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderDtoV2 } from '../v2/dtos/create-order-v2.dto';
import { OrderMapper } from '../mappers/order.mapper';
import { OrderResponseDtoV2 } from '../v2/dtos/order-response-v2.dto';

@Injectable()
export class OrdersServiceV2 {
    constructor(private readonly orderRepository: OrderRepository) { }

    async create(dto: CreateOrderDtoV2): Promise<OrderResponseDtoV2> {
        // 1. Map DTO to Domain
        const orderEntity = OrderMapper.toDomainFromV2(dto);

        // 2. Version specific logic
        if (orderEntity.deliveryType === 'EXPRESS') {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            orderEntity.estimatedDeliveryDate = date;
        } else {
            const date = new Date();
            date.setDate(date.getDate() + 5);
            orderEntity.estimatedDeliveryDate = date;
        }

        // 3. Persistence
        const createdDoc = await this.orderRepository.create(orderEntity);

        // 4. Map back to Domain -> Response
        const savedEntity = OrderMapper.toDomain(createdDoc);
        return OrderMapper.toResponseV2(savedEntity);
    }

    async findAll(): Promise<OrderResponseDtoV2[]> {
        const docs = await this.orderRepository.find({});
        return docs.map((doc) => OrderMapper.toResponseV2(OrderMapper.toDomain(doc)));
    }
}
