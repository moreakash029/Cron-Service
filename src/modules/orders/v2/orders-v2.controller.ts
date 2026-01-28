import { Controller, Post, Body, Get, Version } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { OrdersServiceV2 } from '../services/orders-v2.service';
import { CreateOrderDtoV2 } from '../v2/dtos/create-order-v2.dto';
import { OrderResponseDtoV2 } from '../v2/dtos/order-response-v2.dto';

@ApiTags('Orders V2')
@Controller('orders')
export class OrdersV2Controller {
  constructor(private readonly ordersService: OrdersServiceV2) { }

  @Post()
  @Version('2')
  @ApiOperation({ summary: 'Create Order V2' })
  @ApiResponse({ status: 201, type: OrderResponseDtoV2 })
  async create(@Body() dto: CreateOrderDtoV2): Promise<OrderResponseDtoV2> {
    return this.ordersService.create(dto);
  }

  @Get()
  @Version('2')
  @ApiOperation({ summary: 'List Orders V2' })
  async findAll(): Promise<OrderResponseDtoV2[]> {
    return this.ordersService.findAll();
  }
}
