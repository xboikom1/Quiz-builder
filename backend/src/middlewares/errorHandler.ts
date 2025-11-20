import type { ErrorRequestHandler } from 'express';
import createHttpError from 'http-errors';
import { ZodError } from 'zod';

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      status: 400,
      message: 'Validation failed',
      issues: error.issues,
    });
  }

  if (createHttpError.isHttpError(error)) {
    return res.status(error.status).json({
      status: error.status,
      message: error.message,
    });
  }

  console.error('Unexpected error:', error);
  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({ status: 500, message: 'Internal server error' });
};
