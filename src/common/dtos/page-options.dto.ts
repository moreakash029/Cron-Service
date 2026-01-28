import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_MAX_LIMIT } from '../constants/common.constants';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: DEFAULT_PAGE_MAX_LIMIT,
    default: DEFAULT_PAGE_LIMIT,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(DEFAULT_PAGE_MAX_LIMIT)
  @IsOptional()
  readonly limit?: number = DEFAULT_PAGE_LIMIT;

  get skip(): number {
    return ((this.page || 1) - 1) * (this.limit || DEFAULT_PAGE_LIMIT);
  }
}
