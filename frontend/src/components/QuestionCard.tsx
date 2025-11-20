import type { Question } from '../types/quiz';

const QuestionCard = ({ question }: { question: Question }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-base font-semibold text-slate-900">{question.prompt}</h3>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase text-slate-600">
        {question.type}
      </span>
    </div>

    {question.type === 'BOOLEAN' && (
      <p className="text-sm text-slate-600">
        Correct answer: <strong>{question.booleanAnswer ? 'True' : 'False'}</strong>
      </p>
    )}

    {question.type === 'INPUT' && (
      <p className="text-sm text-slate-600">
        Expected answer:
        <span className="ml-1 rounded bg-slate-100 px-2 py-1 text-slate-800">
          {question.textAnswer}
        </span>
      </p>
    )}

    {question.type === 'CHECKBOX' && question.options && (
      <ul className="space-y-2 text-sm">
        {question.options.map((option) => (
          <li
            key={option.id ?? option.text}
            className={`flex items-center justify-between rounded border px-3 py-2 ${
              option.isCorrect
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            <span>{option.text}</span>
            {option.isCorrect && <span className="text-xs font-semibold">Correct</span>}
          </li>
        ))}
      </ul>
    )}
  </article>
);

export default QuestionCard;
