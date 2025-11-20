import { Router } from 'express';
import quizzesRouter from './quizzes';

const router = Router();

router.use('/quizzes', quizzesRouter);

export default router;
