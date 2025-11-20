import type { RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Route not found',
  });
};
