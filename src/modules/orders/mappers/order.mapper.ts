import { OrderEntity } from '../entities/order.entity';
import { CreateOrderDtoV1 } from '../v1/dtos/create-order-v1.dto';
import { CreateOrderDtoV2 } from '../v2/dtos/create-order-v2.dto';
import { OrderResponseDtoV1 } from '../v1/dtos/order-response-v1.dto';
import { OrderResponseDtoV2 } from '../v2/dtos/order-response-v2.dto';
import { OrderDocument } from '../schemas/order.schema';

export class OrderMapper {
  static toDomain(doc: OrderDocument): OrderEntity {
    return new OrderEntity({
      id: doc._id.toString(),
      orderNumber: doc.orderNumber,
      customerName: doc.customerName,
      totalAmount: doc.totalAmount,
      status: doc.status,
      deliveryType: doc.deliveryType,
      estimatedDeliveryDate: doc.estimatedDeliveryDate,
      createdAt: (doc as any).createdAt as Date,
      updatedAt: (doc as any).updatedAt as Date,
    });
  }

  static toDomainFromV1(dto: CreateOrderDtoV1): OrderEntity {
    return new OrderEntity({
      orderNumber: dto.orderNumber,
      customerName: dto.customerName,
      totalAmount: dto.totalAmount,
      status: 'PENDING',
    });
  }

  static toDomainFromV2(dto: CreateOrderDtoV2): OrderEntity {
    return new OrderEntity({
      orderNumber: dto.orderNumber,
      customerName: dto.customerName,
      totalAmount: dto.totalAmount,
      deliveryType: dto.deliveryType || 'STANDARD',
      status: 'PENDING',
    });
  }

  static toResponseV1(entity: OrderEntity): OrderResponseDtoV1 {
    return {
      id: entity.id,
      orderNumber: entity.orderNumber,
      customerName: entity.customerName,
      totalAmount: entity.totalAmount,
      status: entity.status,
    };
  }

  static toResponseV2(entity: OrderEntity): OrderResponseDtoV2 {
    return {
      id: entity.id,
      orderNumber: entity.orderNumber,
      customerName: entity.customerName,
      totalAmount: entity.totalAmount,
      status: entity.status,
      deliveryType: entity.deliveryType,
      estimatedDeliveryDate: entity.estimatedDeliveryDate,
    };
  }
}
