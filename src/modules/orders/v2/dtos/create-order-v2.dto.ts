import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDtoV2 {
  @ApiProperty({ example: 'ORD-002' })
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @ApiProperty({ example: 'EXPRESS', enum: ['STANDARD', 'EXPRESS'], required: false })
  @IsOptional()
  @IsString()
  deliveryType?: string;
}
