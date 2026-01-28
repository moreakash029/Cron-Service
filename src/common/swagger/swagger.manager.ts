import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { API_DOCUMENTATION_DESCRIPTION, DEFAULT_APP_NAME } from '../constants/common.constants';
require('dotenv').config();

export class SwaggerManager {
    static setup(app: INestApplication): void {
        const configService = app.get(ConfigService);
        const appName = configService.get<string>('app.name') || DEFAULT_APP_NAME;

        // setup document builder
        const builder = new DocumentBuilder()
            .setTitle(appName)
            .setDescription(API_DOCUMENTATION_DESCRIPTION)
            .setVersion('Latest')
            .addBearerAuth()
            .addServer(process.env.BASE_URL!, process.env.NODE_ENV)
            .build();

        const masterDoc = SwaggerModule.createDocument(app, builder);

        // Discover Versions dynamically from Paths
        const versions = this.discoverVersions(masterDoc);
        // Setup Individual Version Pages
        const explorerUrls: { url: string; name: string }[] = [];
        // Add "All Versions" option first
        explorerUrls.push({
            url: '/api-docs/all-json',
            name: 'All Versions',
        });
        // Setup the endpoint for the master JSON
        SwaggerModule.setup('api-docs/all', app, masterDoc);

        // Setup specific versions
        versions.forEach((version) => {
            const vDoc = this.filterDocByVersion(masterDoc, version);

            const path = `api-docs/v${version}`;
            SwaggerModule.setup(path, app, vDoc);

            explorerUrls.push({
                url: `/${path}-json`,
                name: `Version ${version}`,
            });
        });

        // Setup Main Explorer with Dropdown
        // We pass masterDoc here just as a default initial view, but the explorer options will control the dropdown
        SwaggerModule.setup('api-docs', app, masterDoc, {
            explorer: true,
            swaggerOptions: {
                urls: explorerUrls,
                'urls.primaryName': 'All Versions', // Default selection
                persistAuthorization: true,
            },
        });
    }

    /**
     * Scans the OpenAPI paths to detect which API versions are present.
     * Assumes URI versioning format: /v{version}/...
     */
    private static discoverVersions(doc: OpenAPIObject): string[] {
        const versions = new Set<string>();

        Object.keys(doc.paths).forEach((path) => {
            // Regex to match /v1/, /v2/ etc. at the start of the path
            const match = path.match(/^\/v(\d+)\//);
            if (match && match[1]) {
                versions.add(match[1]);
            }
        });

        return Array.from(versions).sort();
    }

    /**
     * Creates a new OpenAPI document containing only paths for the specified version.
     */
    private static filterDocByVersion(masterDoc: OpenAPIObject, version: string): OpenAPIObject {
        const versionPrefix = `/v${version}/`;

        const filteredPaths: Record<string, any> = {};
        Object.keys(masterDoc.paths).forEach((path) => {
            if (path.startsWith(versionPrefix)) {
                filteredPaths[path] = masterDoc.paths[path];
            }
        });

        // Return a structured clone (shallow copy of top level, deep copy of paths)
        return {
            ...masterDoc,
            info: {
                ...masterDoc.info,
                version: `${version}.0`,
                title: `${masterDoc.info.title} (v${version})`,
                description: `API Documentation for Version ${version}`,
            },
            paths: filteredPaths,
        };
    }
}
