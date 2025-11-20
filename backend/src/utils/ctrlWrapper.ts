import type { RequestHandler } from 'express';

export const ctrlWrapper = (controller: RequestHandler): RequestHandler => {
  const wrapped: RequestHandler = async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return wrapped;
};
