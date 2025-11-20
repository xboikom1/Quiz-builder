import type { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import type { QuizPayload } from '../validators/quiz';

type QuizWithCount = Prisma.QuizGetPayload<{
  include: { _count: { select: { questions: true } } };
}>;

const questionInclude = {
  include: { options: true },
  orderBy: { order: 'asc' as const },
};

export const createQuiz = async (payload: QuizPayload) => {
  const quiz = await prisma.quiz.create({
    data: {
      title: payload.title,
      questions: {
        create: payload.questions.map((question, index) => ({
          prompt: question.prompt,
          type: question.type,
          order: question.order ?? index,
          booleanAnswer: question.type === 'BOOLEAN' ? (question.booleanAnswer ?? null) : null,
          textAnswer: question.type === 'INPUT' ? (question.textAnswer ?? null) : null,
          options:
            question.type === 'CHECKBOX'
              ? {
                  create:
                    question.options?.map((option) => ({
                      text: option.text,
                      isCorrect: option.isCorrect,
                    })) ?? [],
                }
              : undefined,
        })),
      },
    },
    include: {
      questions: questionInclude,
    },
  });

  return quiz;
};

export const listQuizzes = async () => {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { questions: true } } },
  });

  return quizzes.map((quiz: QuizWithCount) => ({
    id: quiz.id,
    title: quiz.title,
    questionCount: quiz._count.questions,
    createdAt: quiz.createdAt,
  }));
};

export const getQuizById = async (id: string) => {
  return prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: questionInclude,
    },
  });
};

export const deleteQuizById = async (id: string) => {
  try {
    await prisma.quiz.delete({ where: { id } });
    return true;
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      typeof (error as { code?: unknown }).code === 'string' &&
      (error as { code: string }).code === 'P2025'
    ) {
      return false;
    }
    throw error;
  }
};
