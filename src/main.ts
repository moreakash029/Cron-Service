
import tracer from "./signoz/tracer";
// require("../console-instrumentation");
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerManager } from "./common/swagger/swagger.manager";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import helmet from "helmet";
import compression from "compression";
import { Logger } from "@nestjs/common";
import { ALLOWED_METHODS } from './common/constants/common.constants';

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  try {
    await tracer.start();
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>("PORT");
    const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS')?.split(',') || [];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ALLOWED_METHODS,
  });
  // Security & Optimization
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
  app.use(compression());

    // Versioning
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: "1",
    });

    // Global Pipe/Filter/Interceptor
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      })
    );

    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    // Initialize Dynamic Swagger
    SwaggerManager.setup(app);

    await app.listen(port!);
    console.info(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    logger.error("Error starting application:", error);
    process.exit(1);
  }
}
bootstrap();
