import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { LoggerService } from 'src/logger/logger.service';

@Controller('api/health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private logger: LoggerService,
  ) { }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }

  @Get('/ping')
  ping() {
    this.logger.info('Ping received log');
    this.logger.error('Ping received error');
    this.logger.warn('Ping received warn');
    this.logger.debug('Ping received debug');
    this.logger.verbose('Ping received verbose');
    return { message: 'pong' };
  }
} 