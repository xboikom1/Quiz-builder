import { createAsyncThunk } from '@reduxjs/toolkit';
import type { CreateQuizPayload, QuizDetail, QuizSummary } from '../../../types/quiz';
import { QuizService } from '../../../services/api';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unknown error occurred';

export const fetchQuizzes = createAsyncThunk<QuizSummary[], void, { rejectValue: string }>(
  'quizzes/fetchAll',
  async (_arg, thunkAPI) => {
    try {
      return await QuizService.list();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchQuizById = createAsyncThunk<QuizDetail, string, { rejectValue: string }>(
  'quizzes/fetchById',
  async (id, thunkAPI) => {
    try {
      return await QuizService.detail(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createQuiz = createAsyncThunk<QuizDetail, CreateQuizPayload, { rejectValue: string }>(
  'quizzes/create',
  async (payload, thunkAPI) => {
    try {
      return await QuizService.create(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteQuiz = createAsyncThunk<string, string, { rejectValue: string }>(
  'quizzes/delete',
  async (id, thunkAPI) => {
    try {
      await QuizService.remove(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);
