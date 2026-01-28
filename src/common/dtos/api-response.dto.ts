/**
 * Wrapper DTO for API responses that allows controllers to provide custom messages
 * 
 * Usage in controllers:
 * return { data: result, message: 'Order created successfully' };
 * 
 * If no message is provided, a default message will be used
 */

export interface ErrorDetailsDto {
    field: string;
    message: string;
}

export interface ErrorsDto {
    message: string;
    details: ErrorDetailsDto[];
}

export interface ApiResponseDto<T> {
    success: boolean;
    status_code: number;
    data?: T;
    message?: string;
    errors?: ErrorsDto;
    meta?: any;
}

/**
 * Check if response is wrapped in ApiResponseDto format
 */
export function isApiResponseDto<T>(obj: any): obj is ApiResponseDto<T> {
    return obj && typeof obj === 'object' && 'data' in obj;
}
