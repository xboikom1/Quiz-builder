import type { CreateQuizPayload, QuizDetail, QuizSummary } from '../types/quiz';

type ApiResponse<T> = {
  status: number;
  message?: string;
  data: T;
};

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    const message = errorPayload?.message ?? 'Unexpected API error';
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json()) as ApiResponse<T> | T;

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
}

export const QuizService = {
  list: () => request<QuizSummary[]>('/quizzes'),
  detail: (id: string) => request<QuizDetail>(`/quizzes/${id}`),
  create: (payload: CreateQuizPayload) =>
    request<QuizDetail>('/quizzes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  remove: (id: string) =>
    request<void>(`/quizzes/${id}`, {
      method: 'DELETE',
    }),
};
