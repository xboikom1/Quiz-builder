import type { Request, Response } from 'express';
import createHttpError from 'http-errors';
import {
  createQuiz as createQuizService,
  deleteQuizById,
  getQuizById,
  listQuizzes,
} from '../services/quizzes';
import type { QuizPayload } from '../validators/quiz';

export const createQuizController = async (req: Request, res: Response) => {
  const quiz = await createQuizService(req.body as QuizPayload);
  res.status(201).json({ status: 201, message: 'Quiz created', data: quiz });
};

export const listQuizzesController = async (_req: Request, res: Response) => {
  const quizzes = await listQuizzes();
  res.json({ status: 200, data: quizzes });
};

export const getQuizController = async (req: Request, res: Response) => {
  const quiz = await getQuizById(req.params.id);

  if (!quiz) {
    throw createHttpError(404, 'Quiz not found');
  }

  res.json({ status: 200, data: quiz });
};

export const deleteQuizController = async (req: Request, res: Response) => {
  const deleted = await deleteQuizById(req.params.id);

  if (!deleted) {
    throw createHttpError(404, 'Quiz not found');
  }

  res.status(204).send();
};
