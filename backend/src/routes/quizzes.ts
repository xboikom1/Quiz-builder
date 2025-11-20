import { Router } from 'express';
import {
  createQuizController,
  deleteQuizController,
  getQuizController,
  listQuizzesController,
} from '../controllers/quizzes';
import { validateIdParam } from '../middlewares/validateIdParam';
import { validateRequest } from '../middlewares/validateRequest';
import { quizPayloadSchema } from '../validators/quiz';
import { ctrlWrapper } from '../utils/ctrlWrapper';

const router = Router();

router.get('/', ctrlWrapper(listQuizzesController));

router.get('/:id', validateIdParam('id'), ctrlWrapper(getQuizController));

router.post('/', validateRequest(quizPayloadSchema), ctrlWrapper(createQuizController));

router.delete('/:id', validateIdParam('id'), ctrlWrapper(deleteQuizController));

export default router;
