import { Link } from 'react-router-dom';

const QuizListHeader = () => (
  <header className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Quizzes</h1>
      <p className="text-sm text-slate-500">Browse and manage all available quizzes.</p>
    </div>
    <Link
      to="/create"
      className="rounded-md bg-brand-600 px-4 py-2 text-white shadow-sm transition hover:bg-brand-700"
    >
      New quiz
    </Link>
  </header>
);

export default QuizListHeader;
