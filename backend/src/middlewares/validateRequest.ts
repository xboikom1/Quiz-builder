import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

export const validateRequest = (schema: ZodTypeAny): RequestHandler => {
  return async (req, _res, next) => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      next(error);
    }
  };
};
