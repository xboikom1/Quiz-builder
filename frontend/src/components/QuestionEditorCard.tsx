import { Fragment } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import type { Control, FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form';
import type { QuestionType } from '../types/quiz';
import type { CreateQuizFormValues } from '../pages/CreateQuizPage';

interface QuestionEditorCardProps {
  index: number;
  isRemovable: boolean;
  register: UseFormRegister<CreateQuizFormValues>;
  control: Control<CreateQuizFormValues>;
  errors: FieldErrors<CreateQuizFormValues>;
  watch: UseFormWatch<CreateQuizFormValues>;
  onRemove: () => void;
  onTypeChange: (type: QuestionType) => void;
}

const questionTypeOptions: Array<{ label: string; value: QuestionType }> = [
  { label: 'True / False', value: 'BOOLEAN' },
  { label: 'Short Answer', value: 'INPUT' },
  { label: 'Multiple Select', value: 'CHECKBOX' },
];

const QuestionEditorCard = ({
  index,
  isRemovable,
  register,
  control,
  errors,
  watch,
  onRemove,
  onTypeChange,
}: QuestionEditorCardProps) => {
  const type = watch(`questions.${index}.type`);
  const optionArray = useFieldArray({
    control,
    name: `questions.${index}.options` as const,
  });

  const questionErrors = errors.questions?.[index];
  const rootOptionsError =
    !Array.isArray(questionErrors?.options) && questionErrors?.options?.message
      ? String(questionErrors.options.message)
      : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="flex flex-1 flex-col text-sm font-medium text-slate-600">
          Question prompt
          <textarea
            {...register(`questions.${index}.prompt` as const)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            rows={2}
            placeholder="Type the question"
          />
          {questionErrors?.prompt && (
            <span className="mt-1 text-xs text-red-600">{questionErrors.prompt.message}</span>
          )}
        </label>
        <label className="flex w-full flex-col text-sm font-medium text-slate-600 md:w-52">
          Type
          <select
            {...register(`questions.${index}.type` as const, {
              onChange: (event) => onTypeChange(event.target.value as QuestionType),
            })}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            {questionTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {type === 'INPUT' && (
        <label className="mt-4 flex flex-col text-sm font-medium text-slate-600">
          Expected answer
          <input
            type="text"
            {...register(`questions.${index}.textAnswer` as const)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="Short text answer"
          />
          {questionErrors?.textAnswer && (
            <span className="mt-1 text-xs text-red-600">{questionErrors.textAnswer.message}</span>
          )}
        </label>
      )}

      {type === 'BOOLEAN' && (
        <Controller
          control={control}
          name={`questions.${index}.booleanAnswer` as const}
          render={({ field }) => (
            <fieldset className="mt-4 space-y-2">
              <legend className="text-sm font-medium text-slate-600">Correct answer</legend>
              <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <input
                  type="radio"
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                  className="text-brand-600"
                />
                True
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <input
                  type="radio"
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                  className="text-brand-600"
                />
                False
              </label>
              {questionErrors?.booleanAnswer && (
                <span className="text-xs text-red-600">{questionErrors.booleanAnswer.message}</span>
              )}
            </fieldset>
          )}
        />
      )}

      {type === 'CHECKBOX' && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm font-medium text-slate-600">
            <span>Options</span>
            <button
              type="button"
              onClick={() => optionArray.append({ text: '', isCorrect: false })}
              className="text-brand-600 hover:text-brand-700"
            >
              + Add option
            </button>
          </div>
          <div className="space-y-2">
            {optionArray.fields.map((option, optionIndex) => (
              <Fragment key={option.id}>
                <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                  <input
                    type="checkbox"
                    {...register(`questions.${index}.options.${optionIndex}.isCorrect` as const)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      {...register(`questions.${index}.options.${optionIndex}.text` as const)}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                    {Array.isArray(questionErrors?.options) &&
                      questionErrors.options[optionIndex]?.text && (
                        <span className="mt-1 block text-xs text-red-600">
                          {questionErrors.options[optionIndex]?.text?.message}
                        </span>
                      )}
                  </div>
                  {optionArray.fields.length > 2 && (
                    <button
                      type="button"
                      onClick={() => optionArray.remove(optionIndex)}
                      className="text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </Fragment>
            ))}
          </div>
          {rootOptionsError && <span className="text-xs text-red-600">{rootOptionsError}</span>}
        </div>
      )}

      {isRemovable && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-4 text-sm font-medium text-red-600 hover:text-red-700"
        >
          Remove question
        </button>
      )}
    </div>
  );
};

export default QuestionEditorCard;
