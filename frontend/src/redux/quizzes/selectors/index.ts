import type { RootState } from '../../store';

const selectQuizzesState = (state: RootState) => state.quizzes;

export const selectQuizSummaries = (state: RootState) => selectQuizzesState(state).summaries;

export const selectQuizEntities = (state: RootState) => selectQuizzesState(state).entities;

export const selectActiveQuizId = (state: RootState) => selectQuizzesState(state).activeQuizId;

export const selectActiveQuiz = (state: RootState) => {
  const slice = selectQuizzesState(state);
  return slice.activeQuizId ? slice.entities[slice.activeQuizId] : undefined;
};

export const selectQuizById = (state: RootState, quizId?: string | null) => {
  if (!quizId) {
    return undefined;
  }
  return selectQuizzesState(state).entities[quizId];
};

export const selectQuizzesListRequest = (state: RootState) =>
  selectQuizzesState(state).requests.list;

export const selectQuizzesDetailRequest = (state: RootState) =>
  selectQuizzesState(state).requests.detail;

export const selectQuizzesCreateRequest = (state: RootState) =>
  selectQuizzesState(state).requests.create;

export const selectQuizzesDeleteRequest = (state: RootState) =>
  selectQuizzesState(state).requests.delete;
