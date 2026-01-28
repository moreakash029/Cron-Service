import { Module } from "@nestjs/common";
import { ClsModule } from "nestjs-cls";
import { LoggerModule } from "./logger/logger.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DatabaseModule } from "@thesleepcompany/db-wrapper"; // install @thesleepcompany/db-wrapper for database
import { OrdersModule } from "./modules/orders/orders.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { loadConfig } from "./config/config.loader";
import { TemplateModule } from "./modules/template/template.module";
import { HealthController } from "./health/health.controller";
import { TerminusModule } from "@nestjs/terminus";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls, req: any) => {
          cls.set('api_endpoint', req.originalUrl || req.url);
          cls.set('http_method', req.method);
        },
      },
    }),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [loadConfig],
    }),

    TerminusModule,
    HttpModule,

    DatabaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>("DB_URL"),
      }),
    }),
    OrdersModule,
    TemplateModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule { }
