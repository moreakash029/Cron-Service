import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderDtoV1 } from '../v1/dtos/create-order-v1.dto';
import { OrderMapper } from '../mappers/order.mapper';
import { OrderResponseDtoV1 } from '../v1/dtos/order-response-v1.dto';
import { SchemaOptions, PaginationOptions } from '@thesleepcompany/db-wrapper';

@Injectable()
export class OrdersServiceV1 {
    constructor(private readonly orderRepository: OrderRepository) { }

    async create(dto: CreateOrderDtoV1): Promise<OrderResponseDtoV1> {
        // 1. Map DTO to Domain
        const orderEntity = OrderMapper.toDomainFromV1(dto);

        // 2. Business Logic / Invariants
        if (orderEntity.totalAmount < 0) {
            throw new BadRequestException('Total amount cannot be negative');
        }

        // 3. Persistence
        const createdDoc = await this.orderRepository.create(orderEntity);

        // 4. Map back to Domain -> Response
        const savedEntity = OrderMapper.toDomain(createdDoc);
        return OrderMapper.toResponseV1(savedEntity);
    }

    async findAll(): Promise<OrderResponseDtoV1[]> {
        const docs = await this.orderRepository.find({});
        return docs.map((doc) => OrderMapper.toResponseV1(OrderMapper.toDomain(doc)));
    }

    // ============ TESTING METHODS FOR BASE REPOSITORY ============

    /**
     * Test findById with isDeleted option
     */
    async testFindById(id: string, options?: SchemaOptions): Promise<OrderResponseDtoV1 | null> {
        console.log('here at service', id)
        const doc = await this.orderRepository.findByIdOrFail(id, options);
        if (!doc) return null;
        return OrderMapper.toResponseV1(OrderMapper.toDomain(doc));
    }

    /**
     * Test findOne with filters and isDeleted option
     */
    async testFindOne(orderNumber: string, options?: SchemaOptions): Promise<OrderResponseDtoV1 | null> {
        const doc = await this.orderRepository.findOne({ orderNumber }, options);
        if (!doc) return null;
        return OrderMapper.toResponseV1(OrderMapper.toDomain(doc));
    }

    /**
     * Test findOne with flexible filter object and isDeleted option
     */
    async testFindOneWithFilter(filter: any, options?: SchemaOptions): Promise<OrderResponseDtoV1 | null> {
        const doc = await this.orderRepository.findOne(filter, options);
        if (!doc) return null;
        return OrderMapper.toResponseV1(OrderMapper.toDomain(doc));
    }

    /**
     * Test find with pagination, sorting, and isDeleted
     */
    async testFind(
        filter: any = {},
        options: PaginationOptions & SchemaOptions = {}
    ): Promise<{
        data: OrderResponseDtoV1[];
        meta: { total: number; page?: number; limit?: number };
    }> {
        const docs = await this.orderRepository.find(filter, options);
        const total = await this.orderRepository.count(filter, options);

        return {
            data: docs.map((doc) => OrderMapper.toResponseV1(OrderMapper.toDomain(doc))),
            meta: {
                total,
                page: options.page,
                limit: options.limit,
            },
        };
    }

    /**
     * Test update with isDeleted handling
     */
    async testUpdate(
        id: string,
        updateData: Partial<CreateOrderDtoV1>,
        options?: SchemaOptions
    ): Promise<OrderResponseDtoV1> {
        const updated = await this.orderRepository.update(
            { _id: id },
            updateData,
            options
        );

        if (!updated) {
            throw new NotFoundException('Order not found or is deleted');
        }

        return OrderMapper.toResponseV1(OrderMapper.toDomain(updated));
    }

    /**
     * Test hard delete
     */
    async testDelete(id: string): Promise<{ success: boolean; message: string }> {
        const deleted = await this.orderRepository.delete({ _id: id });
        if (!deleted) {
            throw new NotFoundException('Order not found');
        }
        return { success: true, message: 'Order permanently deleted' };
    }

    /**
     * Test soft delete
     */
    async testSoftDelete(id: string): Promise<OrderResponseDtoV1> {
        const softDeleted = await this.orderRepository.softDeleteById(id);
        if (!softDeleted) {
            throw new NotFoundException('Order not found');
        }
        return OrderMapper.toResponseV1(OrderMapper.toDomain(softDeleted));
    }

    /**
     * Test restore
     */
    async testRestore(id: string): Promise<OrderResponseDtoV1> {
        const restored = await this.orderRepository.restoreById(id);
        if (!restored) {
            throw new NotFoundException('Order not found');
        }
        return OrderMapper.toResponseV1(OrderMapper.toDomain(restored));
    }

    /**
     * Test count with isDeleted option
     */
    async testCount(filter: any = {}, options?: SchemaOptions): Promise<{ count: number }> {
        const count = await this.orderRepository.count(filter, options);
        return { count };
    }

    /**
     * Test exists with isDeleted option
     */
    async testExists(id: string, options?: SchemaOptions): Promise<{ exists: boolean }> {
        const exists = await this.orderRepository.exists({ _id: id }, options);
        return { exists };
    }

    /**
     * Test multi-field sorting
     */
    async testMultiSort(filter: any, sortConfig: any): Promise<OrderResponseDtoV1[]> {
        const docs = await this.orderRepository.find(filter, { sort: sortConfig });
        return docs.map(doc => OrderMapper.toResponseV1(OrderMapper.toDomain(doc)));
    }

    /**
     * Test aggregation pipeline
     */
    async testAggregate(pipeline: any[]): Promise<any[]> {
        return this.orderRepository.aggregate(pipeline);
    }

    /**
     * Test lookup (join)
     */
    async testLookup(filter: any, lookupConfig: any): Promise<any[]> {
        return this.orderRepository.lookupAndFind(filter, lookupConfig);
    }

    /**
     * Test distinct values
     */
    async testDistinct(field: string, filter?: any): Promise<any[]> {
        return this.orderRepository.distinct(field, filter);
    }

    /**
     * Test update many
     */
    async testUpdateMany(
        filter: any,
        update: any,
        options?: SchemaOptions
    ): Promise<{ matchedCount: number; modifiedCount: number }> {
        return this.orderRepository.updateMany(filter, update, options);
    }

    /**
     * Test delete many
     */
    async testDeleteMany(filter: any): Promise<{ deletedCount: number }> {
        return this.orderRepository.deleteMany(filter);
    }
}
