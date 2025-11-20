import type { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { z } from 'zod';

const idSchema = z.string().uuid({ message: 'Invalid identifier' });

export const validateIdParam = (paramName = 'id'): RequestHandler => {
  return (req, _res, next) => {
    const result = idSchema.safeParse(req.params[paramName]);

    if (!result.success) {
      return next(createHttpError(400, result.error.issues[0]?.message ?? 'Invalid identifier'));
    }

    req.params[paramName] = result.data;
    return next();
  };
};
