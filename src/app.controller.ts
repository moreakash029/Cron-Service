import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { ApiVersion } from './common/decorators/api-version.decorator';

@Controller()
@ApiExcludeController()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@ApiVersion() version: string): string {
    return this.appService.getHello();
  }
}
