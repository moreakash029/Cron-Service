import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Request, Response as ExpressResponse } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorsDto, isApiResponseDto } from '../dtos/api-response.dto';
import { extractVersionFromUrl } from '../utils/api-version.util';

export interface Response<T> {
  success: boolean;
  status_code: number;
  message: string;
  data: T;
  errors?: ErrorsDto
  meta?: any;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();
    const request = ctx.getRequest<Request>();

    const version = extractVersionFromUrl(request.url);

    return next.handle().pipe(
      map((responseData: unknown) => {
        let data: T;
        let message: string;

        // Check if controller returned ApiResponseDto wrapper with custom message
        if (isApiResponseDto(responseData)) {
          data = responseData.data as T;
          message = responseData.message || 'Operation completed successfully';
        } else {
          // Default: treat entire response as data
          data = responseData as T;
          message = 'Operation completed successfully';
        }

        return {
          success: true,
          status_code: response.statusCode,
          message,
          data,
          meta: {
            path: request.url,
            method: request.method,
            timestamp: new Date().toISOString(),
            version,
          },
        };
      }),
    );
  }
}
