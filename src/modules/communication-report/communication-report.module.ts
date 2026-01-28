import { Module } from '@nestjs/common';
import { CommunicationReportService } from './communication-report.service';

@Module({
    providers: [CommunicationReportService],
})
export class CommunicationReportModule { }
