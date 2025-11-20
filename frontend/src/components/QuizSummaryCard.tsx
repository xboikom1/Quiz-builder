import { Link } from 'react-router-dom';
import type { QuizSummary } from '../types/quiz';

interface QuizSummaryCardProps {
  quiz: QuizSummary;
  isDeleting: boolean;
  onDelete: (id: string) => void;
}

const QuizSummaryCard = ({ quiz, isDeleting, onDelete }: QuizSummaryCardProps) => (
  <li className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-200 hover:shadow">
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <Link to={`/quizzes/${quiz.id}`} className="text-lg font-semibold text-slate-900">
          {quiz.title}
        </Link>
        <p className="text-sm text-slate-500">
          {quiz.questionCount} question{quiz.questionCount === 1 ? '' : 's'}
        </p>
      </div>
      <div className="flex gap-2">
        <Link
          to={`/quizzes/${quiz.id}`}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          View
        </Link>
        <button
          type="button"
          onClick={() => onDelete(quiz.id)}
          disabled={isDeleting}
          className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
    <p className="text-xs text-slate-400">Created {new Date(quiz.createdAt).toLocaleString()}</p>
  </li>
);

export default QuizSummaryCard;
