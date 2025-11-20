import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import ErrorNotice from '../components/ErrorNotice';
import QuestionEditorCard from '../components/QuestionEditorCard';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createQuiz } from '../redux/quizzes/operations';
import { selectQuizzesCreateRequest } from '../redux/quizzes/selectors';
import type { CreateQuizPayload, QuestionType } from '../types/quiz';

const questionTypeSchema = z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']);

const optionSchema = z.object({
  text: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
});

const questionSchema = z
  .object({
    prompt: z.string().min(1, 'Prompt is required'),
    type: questionTypeSchema,
    booleanAnswer: z.boolean().optional(),
    textAnswer: z.string().min(1, 'Answer is required').optional(),
    options: z.array(optionSchema).optional(),
  })
  .superRefine((question, ctx) => {
    if (question.type === 'BOOLEAN' && question.booleanAnswer === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Select the correct answer',
        path: ['booleanAnswer'],
      });
    }

    if (question.type === 'INPUT' && !question.textAnswer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide the expected text answer',
        path: ['textAnswer'],
      });
    }

    if (question.type === 'CHECKBOX') {
      if (!question.options || question.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Provide at least two options',
          path: ['options'],
        });
      } else if (!question.options.some((option) => option.isCorrect)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Mark at least one correct option',
          path: ['options'],
        });
      }
    } else if (question.options?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Options are only valid for checkbox questions',
        path: ['options'],
      });
    }
  });

const createQuizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
  questions: z.array(questionSchema).min(1, 'Add at least one question'),
});

export type CreateQuizFormValues = z.infer<typeof createQuizSchema>;

const makeQuestionTemplate = (type: QuestionType): CreateQuizFormValues['questions'][number] => {
  switch (type) {
    case 'INPUT':
      return { prompt: '', type, textAnswer: '' };
    case 'CHECKBOX':
      return {
        prompt: '',
        type,
        options: [
          { text: '', isCorrect: true },
          { text: '', isCorrect: false },
        ],
      };
    default:
      return { prompt: '', type, booleanAnswer: true };
  }
};

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const createRequest = useAppSelector(selectQuizzesCreateRequest);

  const form = useForm<CreateQuizFormValues>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: '',
      questions: [makeQuestionTemplate('BOOLEAN')],
    },
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = form;

  const isSaving = isSubmitting || createRequest.status === 'loading';

  const questionArray = useFieldArray({ control, name: 'questions' });

  const handleTypeChange = (index: number, type: QuestionType) => {
    const prompt = getValues(`questions.${index}.prompt`);
    const template = makeQuestionTemplate(type);
    setValue(
      `questions.${index}`,
      { ...template, prompt },
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const onSubmit = async (values: CreateQuizFormValues) => {
    const payload: CreateQuizPayload = {
      title: values.title.trim(),
      questions: values.questions.map((question, index) => {
        const base = {
          prompt: question.prompt.trim(),
          type: question.type,
          order: index,
        };
        if (question.type === 'BOOLEAN') {
          return {
            ...base,
            booleanAnswer: question.booleanAnswer ?? false,
          };
        }
        if (question.type === 'INPUT') {
          return {
            ...base,
            textAnswer: question.textAnswer?.trim() ?? '',
          };
        }
        return {
          ...base,
          options:
            question.options?.map((option) => ({
              text: option.text.trim(),
              isCorrect: option.isCorrect,
            })) ?? [],
        };
      }),
    };

    try {
      const created = await dispatch(createQuiz(payload)).unwrap();
      navigate(`/quizzes/${created.id}`);
    } catch (error) {
      console.error('Failed to create quiz', error);
    }
  };

  const isRemoveDisabled = questionArray.fields.length <= 1;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Create quiz</h1>
        <p className="text-sm text-slate-500">
          Build custom quizzes with boolean, short answer, and multiple select questions.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <label className="flex flex-col text-sm font-medium text-slate-600">
          Quiz title
          <input
            type="text"
            {...register('title')}
            className="mt-1 rounded-xl border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="Name your quiz"
          />
          {errors.title && (
            <span className="mt-1 text-xs text-red-600">{errors.title.message}</span>
          )}
        </label>

        <div className="space-y-4">
          {questionArray.fields.map((field, index) => (
            <QuestionEditorCard
              key={field.id}
              index={index}
              isRemovable={!isRemoveDisabled}
              register={register}
              control={control}
              errors={errors}
              watch={watch}
              onRemove={() => questionArray.remove(index)}
              onTypeChange={(type: QuestionType) => handleTypeChange(index, type)}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => questionArray.append(makeQuestionTemplate('BOOLEAN'))}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Add question
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-brand-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : 'Save quiz'}
          </button>
        </div>

        {createRequest.error && <ErrorNotice message={createRequest.error} />}
      </form>
    </section>
  );
};

export default CreateQuizPage;
