import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { QuizDetail, QuizSummary } from '../../../types/quiz';
import { createQuiz, deleteQuiz, fetchQuizById, fetchQuizzes } from '../operations';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface RequestState {
  status: RequestStatus;
  error: string | null;
}

const createRequestState = (): RequestState => ({ status: 'idle', error: null });

export interface QuizzesState {
  summaries: QuizSummary[];
  entities: Record<string, QuizDetail>;
  activeQuizId: string | null;
  requests: {
    list: RequestState;
    detail: RequestState;
    create: RequestState;
    delete: RequestState;
  };
}

const initialState: QuizzesState = {
  summaries: [],
  entities: {},
  activeQuizId: null,
  requests: {
    list: createRequestState(),
    detail: createRequestState(),
    create: createRequestState(),
    delete: createRequestState(),
  },
};

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    setActiveQuizId: (state, action: PayloadAction<string | null>) => {
      state.activeQuizId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.requests.list = { status: 'loading', error: null };
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.requests.list = { status: 'succeeded', error: null };
        state.summaries = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.requests.list = {
          status: 'failed',
          error: action.payload ?? action.error.message ?? 'Failed to load quizzes',
        };
      })
      .addCase(fetchQuizById.pending, (state) => {
        state.requests.detail = { status: 'loading', error: null };
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.requests.detail = { status: 'succeeded', error: null };
        const quiz = action.payload;
        state.entities[quiz.id] = quiz;
        state.activeQuizId = quiz.id;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.requests.detail = {
          status: 'failed',
          error: action.payload ?? action.error.message ?? 'Failed to load quiz',
        };
      })
      .addCase(createQuiz.pending, (state) => {
        state.requests.create = { status: 'loading', error: null };
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.requests.create = { status: 'succeeded', error: null };
        const quiz = action.payload;
        state.entities[quiz.id] = quiz;
        state.activeQuizId = quiz.id;
        const summary: QuizSummary = {
          id: quiz.id,
          title: quiz.title,
          createdAt: quiz.createdAt,
          questionCount: quiz.questions.length,
        };
        state.summaries = [summary, ...state.summaries.filter((item) => item.id !== quiz.id)];
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.requests.create = {
          status: 'failed',
          error: action.payload ?? action.error.message ?? 'Failed to create quiz',
        };
      })
      .addCase(deleteQuiz.pending, (state) => {
        state.requests.delete = { status: 'loading', error: null };
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.requests.delete = { status: 'succeeded', error: null };
        const quizId = action.payload;
        delete state.entities[quizId];
        state.summaries = state.summaries.filter((quiz) => quiz.id !== quizId);
        if (state.activeQuizId === quizId) {
          state.activeQuizId = null;
        }
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.requests.delete = {
          status: 'failed',
          error: action.payload ?? action.error.message ?? 'Failed to delete quiz',
        };
      });
  },
});

export const { setActiveQuizId } = quizzesSlice.actions;
export const quizzesReducer = quizzesSlice.reducer;
