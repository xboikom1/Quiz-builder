import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorNotice from '../components/ErrorNotice';
import LoadingMessage from '../components/LoadingMessage';
import QuestionCard from '../components/QuestionCard';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchQuizById } from '../redux/quizzes/operations';
import { setActiveQuizId } from '../redux/quizzes/slice';
import { selectQuizById, selectQuizzesDetailRequest } from '../redux/quizzes/selectors';

const QuizDetailPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const quiz = useAppSelector((state) => selectQuizById(state, id));
  const detailRequest = useAppSelector(selectQuizzesDetailRequest);

  useEffect(() => {
    if (!id) {
      return;
    }
    dispatch(setActiveQuizId(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!id || quiz || detailRequest.status === 'loading') {
      return;
    }
    dispatch(fetchQuizById(id));
  }, [dispatch, id, quiz, detailRequest.status]);

  if ((detailRequest.status === 'loading' || detailRequest.status === 'idle') && !quiz) {
    return <LoadingMessage text="Loading quiz…" />;
  }

  if (!id) {
    return (
      <div className="space-y-3">
        <ErrorNotice message="Quiz not found" />
        <Link
          to="/quizzes"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-600"
        >
          ← Back to quizzes
        </Link>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="space-y-3">
        <ErrorNotice message={detailRequest.error ?? 'Quiz not found'} />
        <Link
          to="/quizzes"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-600"
        >
          ← Back to quizzes
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <Link to="/quizzes" className="text-sm font-medium text-brand-600">
          ← Back to quizzes
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">{quiz.title}</h1>
          <p className="text-sm text-slate-500">
            {quiz.questions.length} question{quiz.questions.length === 1 ? '' : 's'} · Created{' '}
            {new Date(quiz.createdAt).toLocaleString()}
          </p>
        </div>
      </header>

      <div className="space-y-4">
        {quiz.questions.map((question) => (
          <QuestionCard key={question.id ?? question.prompt} question={question} />
        ))}
      </div>
    </section>
  );
};

export default QuizDetailPage;
