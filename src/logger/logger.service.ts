import { ConsoleLogger, Injectable, Scope, Optional, Inject } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { LoggerProvider, BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { OTEL_EXPORTER_OTLP_LOGS_ENDPOINT } from '../common/constants/common.constants';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
    private otelLogger: any;

    constructor(
        @Optional() context: string,
        private readonly cls: ClsService,
    ) {
        super(context || 'LoggerService');
        this.initializeOtel();
    }

    private initializeOtel() {
        const resource = resourceFromAttributes({
            [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'oms-service',
        });

        const logExporter = new OTLPLogExporter({
            url: 'http://localhost:4318/v1/logs',
        });

        const loggerProvider = new LoggerProvider({
            resource,
            processors: [new BatchLogRecordProcessor(logExporter)],
        });

        // Initialize global API (optional but good context)
        logs.setGlobalLoggerProvider(loggerProvider);

        this.otelLogger = loggerProvider.getLogger('default', '1.0.0');
    }

    error(message: any, stack?: string, context?: string) {
        // 1. Call parent to print to console
        super.error(message, stack, context);

        // 2. Send to Signoz
        this.emitToOtel(SeverityNumber.ERROR, 'ERROR', message, context);
    }

    warn(message: any, context?: string) {
        // 1. Call parent to print to console
        super.warn(message, context);

        // 2. Send to Signoz
        this.emitToOtel(SeverityNumber.WARN, 'WARN', message, context);
    }

    info(message: any, context?: string) {
        // Console AND Signoz
        super.log(message, context);
        // this.emitToOtel(SeverityNumber.INFO, 'INFO', message, context);
    }

    debug(message: any, context?: string) {
        // Console ONLY
        super.debug(message, context);
    }

    verbose(message: any, context?: string) {
        // Console ONLY
        super.verbose(message, context);
    }

    private emitToOtel(severityNumber: SeverityNumber, severityText: string, body: any, context?: string,) {
        if (!this.otelLogger) return;

        const attributes: any = context ? { context } : {};

        if (this.cls.isActive()) {
            const apiEndpoint = this.cls.get('api_endpoint');
            const httpMethod = this.cls.get('http_method');

            if (apiEndpoint) attributes['http.route'] = apiEndpoint;
            if (httpMethod) attributes['http.method'] = httpMethod;
        }

        // Ensure body is string for display
        const bodyStr = typeof body === 'object' ? JSON.stringify(body) : String(body);

        this.otelLogger.emit({
            severityNumber,
            severityText,
            body: bodyStr,
            attributes,
        });
    }
}
