import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { extractVersionFromUrl } from '../utils/api-version.util';

/**
 * Extract API version from the route path
 * Looks for /v1/, /v2/, etc. in the request URL
 */
export const ApiVersion = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return extractVersionFromUrl(request.url);
    },
);
