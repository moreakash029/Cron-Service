import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ClsModule } from 'nestjs-cls';

@Global()
@Module({
    imports: [ClsModule],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule { }
