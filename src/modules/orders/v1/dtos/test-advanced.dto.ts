import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsObject, IsArray } from 'class-validator';
// Sample test file
export class TestMultiSortDto {
    @ApiProperty({
        description: 'Filter criteria',
        example: { status: 'PENDING' },
        required: false
    })
    @IsOptional()
    @IsObject()
    filter?: any;

    @ApiProperty({
        description: 'Sort configuration (1=ASC, -1=DESC)',
        example: { status: 1, totalAmount: -1 }
    })
    @IsNotEmpty()
    @IsObject()
    sortConfig: Record<string, any>;
}

export class TestAggregateDto {
    @ApiProperty({
        description: 'Aggregation pipeline stages',
        example: [
            { "$group": { "_id": "$status", "count": { "$sum": 1 } } },
            { "$sort": { "count": -1 } }
        ],
        type: [Object]
    })
    @IsNotEmpty()
    @IsArray()
    pipeline: Record<string, any>[];
}

export class TestLookupDto {
    @ApiProperty({
        description: 'Filter criteria',
        example: { status: 'PENDING' },
        required: false
    })
    @IsOptional()
    @IsObject()
    filter?: any;

    @ApiProperty({
        description: 'Lookup (Join) configuration',
        example: {
            from: 'customers',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customerDetails',
            unwind: true
        }
    })
    @IsNotEmpty()
    @IsObject()
    lookupConfig: {
        from: string;
        localField: string;
        foreignField: string;
        as: string;
        unwind?: boolean;
    };
}

export class TestDistinctDto {
    @ApiProperty({
        description: 'Field to find distinct values for',
        example: 'status'
    })
    @IsNotEmpty()
    @IsString()
    field: string;

    @ApiProperty({
        description: 'Filter criteria',
        example: { totalAmount: { "$gt": 1000 } },
        required: false
    })
    @IsOptional()
    @IsObject()
    filter?: any;
}

export class TestUpdateManyDto {
    @ApiProperty({
        description: 'Filter to select documents to update',
        example: { status: 'PENDING' }
    })
    @IsNotEmpty()
    @IsObject()
    filter: any;

    @ApiProperty({
        description: 'Update operation',
        example: { "$set": { "status": "PROCESSING" } }
    })
    @IsNotEmpty()
    @IsObject()
    update: any;

    @ApiProperty({
        description: 'Include deleted documents?',
        example: false,
        required: false
    })
    @IsOptional()
    @IsBoolean()
    isDeleted?: boolean;
}

export class TestDeleteManyDto {
    @ApiProperty({
        description: 'Filter to select documents to delete',
        example: { status: 'CANCELLED' }
    })
    @IsNotEmpty()
    @IsObject()
    filter: any;
}
