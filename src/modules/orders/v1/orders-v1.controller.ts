import {
  Controller,
  Post,
  Body,
  Get,
  Version,
  Param,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrdersServiceV1 } from '../services/orders-v1.service';
import { CreateOrderDtoV1 } from '../v1/dtos/create-order-v1.dto';
import { OrderResponseDtoV1 } from '../v1/dtos/order-response-v1.dto';
import {
  TestMultiSortDto,
  TestAggregateDto,
  TestLookupDto,
  TestDistinctDto,
  TestUpdateManyDto,
  TestDeleteManyDto
} from '../v1/dtos/test-advanced.dto';
import { ApiVersion } from '../../../common/decorators/api-version.decorator';

@ApiTags('Orders V1')
@Controller('orders')
export class OrdersV1Controller {
  constructor(private readonly ordersService: OrdersServiceV1) { }

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create Order V1' })
  @ApiResponse({ status: 201, type: OrderResponseDtoV1 })
  async create(@Body() dto: CreateOrderDtoV1): Promise<OrderResponseDtoV1> {
    return this.ordersService.create(dto);
  }

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'List Orders V1' })
  async findAll(@ApiVersion() version: string): Promise<OrderResponseDtoV1[]> {
    return this.ordersService.findAll();
  }

  // ============ TESTING ENDPOINTS FOR BASE REPOSITORY ============

  @Get('test/find-by-id/:id')
  @Version('1')
  @ApiOperation({ summary: 'Test findById - Find order by ID with isDeleted option' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiQuery({ name: 'isDeleted', required: false, type: Boolean, description: 'Include deleted? (true = all, false/omit = active only)' })
  async testFindById(
    @Param('id') id: string,
    @Query('isDeleted') isDeleted?: boolean,
  ): Promise<OrderResponseDtoV1 | null> {
    return this.ordersService.testFindById(id, { isDeleted });
  }

  @Post('test/find-one')
  @Version('1')
  @ApiOperation({
    summary: 'Test findOne - Find order with flexible filters via body',
    description: 'Pass any filter in request body. Example: {"orderNumber": "ORD-001"} or {"customerName": "John", "status": "PENDING"}'
  })
  @ApiQuery({ name: 'isDeleted', required: false, type: Boolean, description: 'Include deleted?' })
  @ApiBody({
    description: 'Filter object - any valid MongoDB filter',
    schema: {
      type: 'object',
      example: { orderNumber: 'ORD-001' }
    }
  })
  async testFindOne(
    @Body() filter: any,
    @Query('isDeleted') isDeleted?: boolean,
  ): Promise<OrderResponseDtoV1 | null> {
    return this.ordersService.testFindOneWithFilter(filter, { isDeleted });
  }

  @Post('test/find')
  @Version('1')
  @ApiOperation({
    summary: 'Test find - Find orders with flexible filters, pagination, and sorting',
    description: 'Pass filters in body, pagination/sorting in query params'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (starts from 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field (e.g., "createdAt", "-totalAmount" for desc)' })
  @ApiQuery({ name: 'isDeleted', required: false, type: Boolean, description: 'Include deleted? (true = all, false/omit = active only)' })
  @ApiQuery({ name: 'withPaginationInfo', required: false, type: Boolean, description: 'Include pagination info? (default: false)' })
  @ApiBody({
    description: 'Filter object - any valid MongoDB filter. Examples: {"status": "PENDING"}, {"totalAmount": {"$gte": 1000}}, {"customerName": {"$regex": "John", "$options": "i"}}',
    schema: {
      type: 'object',
      example: { status: 'PENDING' }
    }
  })
  async testFind(
    @Body() filter: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('isDeleted') isDeleted?: boolean,
    @Query('withPaginationInfo') withPaginationInfo?: boolean,
  ) {
    const sort: any = {};
    if (sortBy) {
      const isDescending = sortBy.startsWith('-');
      const field = isDescending ? sortBy.substring(1) : sortBy;
      sort[field] = isDescending ? -1 : 1;
    }

    return this.ordersService.testFind(filter || {}, {
      page,
      limit,
      sort: Object.keys(sort).length > 0 ? sort : undefined,
      withPaginationInfo,
      isDeleted,
    });
  }

  @Patch('test/update/:id')
  @Version('1')
  @ApiOperation({
    summary: 'Test update - Update order with flexible payload (respects isDeleted by default)',
    description: 'Pass any fields to update in request body. Example: {"status": "SHIPPED", "totalAmount": 1600}'
  })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiQuery({ name: 'isDeleted', required: false, type: Boolean, description: 'Update deleted orders? (default: false)' })
  @ApiBody({
    description: 'Update payload - any valid update fields',
    schema: {
      type: 'object',
      example: { status: 'SHIPPED', totalAmount: 1600 }
    }
  })
  async testUpdate(
    @Param('id') id: string,
    @Body() updateData: any,
    @Query('isDeleted') isDeleted?: boolean,
  ): Promise<OrderResponseDtoV1> {
    return this.ordersService.testUpdate(id, updateData, { isDeleted });
  }

  @Delete('test/delete/:id')
  @Version('1')
  @ApiOperation({ summary: 'Test delete - Hard delete order (permanent)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  async testDelete(@Param('id') id: string) {
    return this.ordersService.testDelete(id);
  }

  @Patch('test/soft-delete/:id')
  @Version('1')
  @ApiOperation({ summary: 'Test softDelete - Soft delete order (sets isDeleted=true)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  async testSoftDelete(@Param('id') id: string): Promise<OrderResponseDtoV1> {
    return this.ordersService.testSoftDelete(id);
  }

  @Patch('test/restore/:id')
  @Version('1')
  @ApiOperation({ summary: 'Test restore - Restore soft-deleted order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  async testRestore(@Param('id') id: string): Promise<OrderResponseDtoV1> {
    return this.ordersService.testRestore(id);
  }

  @Post('test/count')
  @Version('1')
  @ApiOperation({
    summary: 'Test count - Count orders with flexible filters',
    description: 'Pass any filter in request body'
  })
  @ApiQuery({ name: 'isDeleted', required: false, type: Boolean, description: 'Include deleted? (default: false = count active only)' })
  @ApiBody({
    description: 'Filter object',
    schema: {
      type: 'object',
      example: { status: 'PENDING' }
    }
  })
  async testCount(
    @Body() filter: any,
    @Query('isDeleted') isDeleted?: boolean,
  ) {
    return this.ordersService.testCount(filter || {}, { isDeleted });
  }

  @Get('test/exists/:id')
  @Version('1')
  @ApiOperation({ summary: 'Test exists - Check if order exists with isDeleted option' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiQuery({ name: 'isDeleted', required: false, type: Boolean, description: 'Check deleted orders? (default: false = check active only)' })
  async testExists(
    @Param('id') id: string,
    @Query('isDeleted') isDeleted?: boolean,
  ) {
    return this.ordersService.testExists(id, { isDeleted });
  }



  @Post('test/multi-sort')
  @Version('1')
  @ApiOperation({ summary: 'Test multi-field sorting' })
  async testMultiSort(@Body() body: TestMultiSortDto) {
    return this.ordersService.testMultiSort(body.filter || {}, body.sortConfig);
  }

  @Post('test/aggregate')
  @Version('1')
  @ApiOperation({ summary: 'Test aggregation pipeline' })
  async testAggregate(@Body() body: TestAggregateDto) {
    return this.ordersService.testAggregate(body.pipeline || []);
  }

  @Post('test/lookup')
  @Version('1')
  @ApiOperation({ summary: 'Test lookup (join)' })
  async testLookup(@Body() body: TestLookupDto) {
    return this.ordersService.testLookup(body.filter || {}, body.lookupConfig);
  }

  @Post('test/distinct')
  @Version('1')
  @ApiOperation({ summary: 'Test distinct values' })
  async testDistinct(@Body() body: TestDistinctDto) {
    return this.ordersService.testDistinct(body.field, body.filter);
  }

  @Post('test/update-many')
  @Version('1')
  @ApiOperation({ summary: 'Test update many documents' })
  async testUpdateMany(@Body() body: TestUpdateManyDto) {
    return this.ordersService.testUpdateMany(body.filter, body.update, { isDeleted: body.isDeleted });
  }

  @Post('test/delete-many')
  @Version('1')
  @ApiOperation({ summary: 'Test delete many documents' })
  async testDeleteMany(@Body() body: TestDeleteManyDto) {
    return this.ordersService.testDeleteMany(body.filter);
  }
}
