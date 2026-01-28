import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TemplateService } from './template.service';
import { PaginationDto } from '../../common/dtos/pagination.dto';

@ApiTags('Template')
@Controller('template')
export class TemplateController {
    constructor(private readonly templateService: TemplateService) {
        // console.log('here inside template controller')
    }

    @Post()
    @ApiOperation({ summary: 'Create resource' })
    create(@Body() createDto: any) {
        return this.templateService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Find all resources' })
    findAll(@Query() paginationDto: PaginationDto) {
        return this.templateService.findAll(paginationDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find resource by id' })
    findOne(@Param('id') id: string) {
        return this.templateService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update resource by id' })
    update(@Param('id') id: string, @Body() updateDto: any) {
        return this.templateService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete resource by id' })
    remove(@Param('id') id: string) {
        return this.templateService.remove(id);
    }
}
