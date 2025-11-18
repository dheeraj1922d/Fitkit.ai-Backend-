import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    details?: any;
  };
}

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errorCode?: string,
  errorDetails?: any
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
  };

  if (errorCode || errorDetails) {
    response.error = {
      code: errorCode,
      details: errorDetails,
    };
  }

  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 */
export const sendValidationError = (
  res: Response,
  errors: any
): Response => {
  return sendError(res, 'Validation error', 400, 'VALIDATION_ERROR', errors);
};

/**
 * Send not found error
 */
export const sendNotFound = (
  res: Response,
  message: string = 'Resource not found'
): Response => {
  return sendError(res, message, 404, 'NOT_FOUND');
};

/**
 * Send unauthorized error
 */
export const sendUnauthorized = (
  res: Response,
  message: string = 'Authentication required'
): Response => {
  return sendError(res, message, 401, 'UNAUTHORIZED');
};

/**
 * Send internal server error
 */
export const sendInternalError = (
  res: Response,
  message: string = 'Internal server error'
): Response => {
  return sendError(res, message, 500, 'INTERNAL_ERROR');
};
