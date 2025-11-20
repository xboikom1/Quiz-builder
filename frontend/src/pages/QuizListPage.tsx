import { useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState';
import ErrorNotice from '../components/ErrorNotice';
import LoadingMessage from '../components/LoadingMessage';
import QuizListHeader from '../components/QuizListHeader';
import QuizSummaryCard from '../components/QuizSummaryCard';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { deleteQuiz, fetchQuizzes } from '../redux/quizzes/operations';
import {
  selectQuizSummaries,
  selectQuizzesDeleteRequest,
  selectQuizzesListRequest,
} from '../redux/quizzes/selectors';

const QuizListPage = () => {
  const dispatch = useAppDispatch();
  const quizzes = useAppSelector(selectQuizSummaries);
  const listRequest = useAppSelector(selectQuizzesListRequest);
  const deleteRequest = useAppSelector(selectQuizzesDeleteRequest);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (listRequest.status === 'idle') {
      dispatch(fetchQuizzes());
    }
  }, [dispatch, listRequest.status]);

  const handleDelete = async (id: string) => {
    setPendingDeleteId(id);
    try {
      await dispatch(deleteQuiz(id)).unwrap();
    } catch (error) {
      console.error('Failed to delete quiz', error);
    } finally {
      setPendingDeleteId((current) => (current === id ? null : current));
    }
  };

  if (listRequest.status === 'loading') {
    return <LoadingMessage text="Loading quizzes…" />;
  }

  if (listRequest.error) {
    return <ErrorNotice message={listRequest.error} />;
  }

  if (quizzes.length === 0) {
    return (
      <EmptyState
        message="No quizzes yet. Start by creating one."
        action={{ label: 'Create quiz', to: '/create' }}
      />
    );
  }

  return (
    <section className="space-y-4">
      <QuizListHeader />

      {deleteRequest.error && <ErrorNotice message={deleteRequest.error} />}

      <ul className="space-y-3">
        {quizzes.map((quiz) => (
          <QuizSummaryCard
            key={quiz.id}
            quiz={quiz}
            isDeleting={pendingDeleteId === quiz.id}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </section>
  );
};

export default QuizListPage;
