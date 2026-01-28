import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { extractVersionFromUrl } from '../utils/api-version.util';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const version = extractVersionFromUrl(request.url);

    // Extract error details
    let message: string | string[] = 'Internal server error';
    let errorDetails: any = null;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, any>;
        message = (resp.message as string | string[]) || (resp.error as string) || message;
        errorDetails = resp;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const responseBody = {
      success: false,
      status_code: status,
      message: Array.isArray(message) ? message.join(', ') : message,
      error: Array.isArray(message)
        ? message.map((m) => ({ message: m }))
        : errorDetails || { message },
      meta: {
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        version,
      },
    };

    response.status(status).json(responseBody);
  }
}
