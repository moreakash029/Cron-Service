# OMS Microservice Boilerplate

This is the standard boilerplate for creating microservices at **The Sleep Company**. It is built on top of **NestJS** and pre-configured with essential tools, best practices, and shared libraries to ensure consistency and scalability across our ecosystem.

## 🚀 Overview

This boilerplate provides a production-ready foundation with:
- **Centralized Configuration**: Loads secrets securely from **AWS Secrets Manager**.
- **Database Integration**: Uses `@thesleepcompany/db-wrapper` for standardized Mongoose/MongoDB connections and repositories.
- **API Documentation**: specific dynamic **Swagger** setup with versioning support.
- **Standardized Responses**: Global interceptors for uniform API response formats.
- **Error Handling**: Global exception filters.
- **Security**: Pre-configured with `helmet`.
- **Performance**: Pre-configured with `compression`.
- **Linting & Formatting**: Strict ESLint and Prettier rules enforced via Husky.

---

## 🛠 Prerequisites

Before starting, ensure you have the following:

- **Node.js**: v18+ recommended.
- **npm**: v9+.
- **AWS Access**: You need valid AWS credentials to access **AWS Secrets Manager**, as the app loads its configuration (Port, DB URL) from there.
- **Private NPM Access**: Ensure you are logged in to the registry hosting `@thesleepcompany/db-wrapper` packages.

---

## 📦 Installation

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```
    *Note: This will also install `@thesleepcompany/db-wrapper`.* Make sure your package.json has the correct version of `@thesleepcompany/db-wrapper`.

3.  **Environment Configuration**
    Create a `.env` file in the root directory. This file is **ONLY** used to boostrap the configuration loader. Actual app config is fetched from AWS.

    ```env
    NODE_ENV=<env-name>
    AWS_SECRET_ARN=<your-aws-secret-arn>
    BASE_URL=http://localhost:3000
    AWS_REGION=<aws-region>
    AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
    AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
    APP_TIMEZONE=<your-app-timezone>
    ```

    | Variable | Description |
    | :--- | :--- |
    | `NODE_ENV` | Environment (development, production). |
    | `AWS_SECRET_ARN` | The ARN of the secret in AWS Secrets Manager containing `PORT`, `DB_URL`, etc. |
    | `BASE_URL` | Base URL of the service (used for Swagger). |
    | `AWS_REGION` | AWS Region |
    | `AWS_ACCESS_KEY_ID` | AWS Access Key ID |
    | `AWS_SECRET_ACCESS_KEY` | AWS Secret Access Key |
    | `APP_TIMEZONE` | App Timezone |

---

## 🏃 Running the Application

```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

---

## 📚 API Documentation (Swagger)

This boilerplate features a **Dynamic Swagger** setup.

- **Access**: Open your browser and go to `http://localhost:3000/api-docs`.
- **Versioning**: The Swagger UI includes a dropdown to switch between API versions (e.g., `All Versions`, `Version 1`).
- **Discovery**: It automatically detects versions based on your controller routes (e.g., `/v1/orders`).

---

## 🧱 Project Structure

The `src` directory is organized as follows:

```
src/
├── common/                 # Shared utilities, DTOs, guards, interceptors
│   ├── dtos/               # Standardized DTOs (Pagination, API Response)
│   ├── filters/            # Global Exception Filters
│   ├── interceptors/       # Global Response Interceptors
│   └── swagger/            # Dynamic Swagger Configuration
├── config/                 # Configuration logic
│   ├── config.loader.ts    # Loads secrets from AWS
│   └── config.validation.ts# Validates environment variables
├── modules/                # Feature Modules (Your Microservice Logic)
│   ├── orders/             # Example Module
│   └── template/           # Template Module
├── main.ts                 # Entry point
└── app.module.ts           # Root Module
|__ .npmrc                  # paste registry url here for installing @thesleepcompany/db-wrapper
```

---

## 🔌 Database Integration (`db-wrapper`)

We use **`@thesleepcompany/db-wrapper`** to standardize database operations.

### 1. Setup in `AppModule`
The wrapper is initialized asynchronously using the config from AWS:

```typescript
// src/app.module.ts
import { DatabaseModule } from '@thesleepcompany/db-wrapper';

@Module({
  imports: [
    DatabaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DB_URL'),
      }),
    }),
    // ...
  ],
})
export class AppModule {}
```

### 2. Using Repositories
Extend `BaseRepository` in your feature repositories to get built-in CRUD methods, pagination, and soft-delete support.

```typescript
// src/modules/orders/repositories/order.repository.ts
import { BaseRepository } from '@thesleepcompany/db-wrapper';

@Injectable()
export class OrderRepository extends BaseRepository<OrderDocument> {
  constructor(@InjectModel(Order.name) model: Model<OrderDocument>) {
    super(model);
  }
}
```

---

## 🧩 Key Features & Standards

### 1. API Response Format
All successful responses are automatically wrapped in a standard format by `ResponseInterceptor`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... }
  "errors": null,
  "meta":{}
}
```

### 2. Pagination
Use the provided `PageOptionsDto` in your controllers to handle pagination automatically.

```typescript
@Get()
findAll(@Query() pageOptions: PageOptionsDto) {
  return this.service.findAll(pageOptions);
}
```

### 3. Versioning
API versioning is enabled by default (URI Versioning).
- Routes should be prefixed with versions (e.g., `@Controller({ path: 'orders', version: '1' })`).
- This maps to `/v1/orders`.

---

## 🤝 Contributing & New Microservices

When creating a new microservice using this boilerplate:
1.  **Clone** this repo.
2.  **Rename** the project in `package.json`.
3.  **Clean up**: Remove the example `orders` and `template` modules.
4.  **Create Module**:
    ```bash
    nest g module modules/your-feature
    nest g controller modules/your-feature
    nest g service modules/your-feature
    ```
5.  **Develop**: Follow the patterns in `src/modules/orders` for Entities, DTOs, and Repositories.

---
**Maintained by The Sleep Company Tech Team**



**Signoz Integration**

1. Clone the SigNoz Repository: First, clone the SigNoz repository 
   - git clone -b main https://github.com/SigNoz/signoz.git

2. Navigate to the Deploy Directory: Change the directory to the deploy folder within the cloned repository
   - cd signoz/deploy/

3. Run the Install Script: Execute the install.sh script to start the installation process. 
   - ./install.sh

Once the installation is complete, you can access the SigNoz UI at http://localhost:8080
  
**Follow the below link for deployment of SigNoz on AWS EKS**

- https://signoz.io/docs/install/kubernetes/aws/

**Integration of signoz in microservices**

1. Install OpenTelemetry Packages
  - npm install --save @opentelemetry/auto-instrumentations-node
  - npm install --save @opentelemetry/exporter-trace-otlp-http
  - npm install --save @opentelemetry/resources
  - npm install --save @opentelemetry/api
  - npm install --save @opentelemetry/sdk-node
  - npm install --save @opentelemetry/semantic-conventions

@opentelemetry/auto-instrumentations-node for auto-instrumenting our Node.js application.
@opentelemetry/exporter-trace-otlp-http for exporting trace data using OTLP (OpenTelemetry Protocol) over HTTP.
@opentelemetry/resources for defining and attaching metadata about our application.
@opentelemetry/api for providing everything needed to interact with the OpenTelemetry API, including all TypeScript interfaces, enums, and no-op implementations.
@opentelemetry/sdk-node for providing tools and functionalities to instrument, generate, collect, and export data.
@opentelemetry/semantic-conventions for standardized naming conventions and constants for telemetry attributes in OpenTelemetry.

**Configure OpenTelemetry Collector**

After installing the necessary packages, you need to configure the OpenTelemetry Collector to receive the trace data and send it to our tracing analytics backend. This involves setting up the endpoint for SigNoz cloud, which is where our application will send the tracing data. If you’re running SigNoz locally, the endpoint might look like http://localhost:4318/v1/traces

**Create a tracer.ts file in source directory and use this sample configuration of OpenTelemetry Collector.**

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTEL_EXPORTER_OTLP_TRACES_ENDPOINT } from '../common/constants/common.constants';

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
});

const sdk = new NodeSDK({
  serviceName: 'oms-service',
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
    }),
  ],
});

export default sdk;


**Start the Tracer**

To start the tracer, you need to import and start it in our application’s main file, typically main.ts. This ensures that the tracer is initialized when our application starts, allowing it to begin collecting and exporting telemetry data.