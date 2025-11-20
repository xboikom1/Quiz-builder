import { z } from 'zod';

export const questionTypeSchema = z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']);

export const optionSchema = z.object({
  text: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
});

export const questionSchema = z
  .object({
    prompt: z.string().min(1, 'Question prompt is required'),
    type: questionTypeSchema,
    order: z.number().int().nonnegative().optional(),
    booleanAnswer: z.boolean().optional(),
    textAnswer: z.string().min(1, 'Answer text is required').optional(),
    options: z.array(optionSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'BOOLEAN' && data.booleanAnswer === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Boolean questions require a booleanAnswer field',
        path: ['booleanAnswer'],
      });
    }

    if (data.type === 'INPUT' && !data.textAnswer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Input questions require a textAnswer field',
        path: ['textAnswer'],
      });
    }

    if (data.type === 'CHECKBOX') {
      if (!data.options || data.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Checkbox questions need at least two options',
          path: ['options'],
        });
      } else if (!data.options.some((option) => option.isCorrect)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Checkbox questions need at least one correct option',
          path: ['options'],
        });
      }
    } else if (data.options?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Only checkbox questions may define options',
        path: ['options'],
      });
    }
  });

export const quizPayloadSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
});

export type QuizPayload = z.infer<typeof quizPayloadSchema>;
export type QuestionPayload = z.infer<typeof questionSchema>;
export type OptionPayload = z.infer<typeof optionSchema>;
