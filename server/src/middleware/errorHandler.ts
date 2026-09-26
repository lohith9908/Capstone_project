import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any[];

  constructor(message: string, statusCode = 400, code = 'BAD_REQUEST', details?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Zod validation error
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload parameters',
        details: err.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
    });
    return;
  }

  // Known custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details || [],
      },
    });
    return;
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    res.status(409).json({
      success: false,
      error: {
        code: 'CONFLICT',
        message: 'A record with this unique attribute already exists',
        details: Object.keys(err.keyValue || {}),
      },
    });
    return;
  }

  console.error('[Unhandled Error]', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected system error occurred',
      details: process.env.NODE_ENV === 'development' ? [err.message] : [],
    },
  });
};
