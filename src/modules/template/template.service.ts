import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplateService {
    create(_createDto: any) {
        return 'This action adds a new resource';
    }

    findAll(_paginationDto: any) {
        return `This action returns all resources`;
    }

    findOne(id: string) {
        return `This action returns a #${id} resource`;
    }

    update(id: string, _updateDto: any) {
        return `This action updates a #${id} resource`;
    }

    remove(id: string) {
        return `This action removes a #${id} resource`;
    }
}
