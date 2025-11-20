export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface Option {
  id?: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id?: string;
  prompt: string;
  type: QuestionType;
  order?: number;
  booleanAnswer?: boolean | null;
  textAnswer?: string | null;
  options?: Option[];
}

export interface QuizSummary {
  id: string;
  title: string;
  questionCount: number;
  createdAt: string;
}

export interface QuizDetail {
  id: string;
  title: string;
  createdAt: string;
  questions: Question[];
}

export interface CreateQuizPayload {
  title: string;
  questions: Array<
    Pick<Question, 'prompt' | 'type' | 'order'> & {
      booleanAnswer?: boolean;
      textAnswer?: string;
      options?: Option[];
    }
  >;
}
