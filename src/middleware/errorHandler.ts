import { Request, Response, NextFunction } from 'express';
import { sendError, sendInternalError } from '../utils/responseHandler';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors: any = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
    sendError(res, 'Validation error', 400, 'VALIDATION_ERROR', errors);
    return;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    sendError(res, `${field} already exists`, 400, 'DUPLICATE_ERROR');
    return;
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    sendError(res, 'Invalid ID format', 400, 'INVALID_ID');
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 401, 'INVALID_TOKEN');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token expired', 401, 'TOKEN_EXPIRED');
    return;
  }

  // Default error
  sendInternalError(res, err.message || 'Something went wrong');
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
};
