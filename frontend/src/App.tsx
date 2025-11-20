import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingMessage from './components/LoadingMessage';

const QuizListPage = lazy(() => import('./pages/QuizListPage'));
const QuizDetailPage = lazy(() => import('./pages/QuizDetailPage'));
const CreateQuizPage = lazy(() => import('./pages/CreateQuizPage'));

const App = () => (
  <Layout>
    <Suspense
      fallback={
        <div className="py-12">
          <LoadingMessage text="Loading page…" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/quizzes" replace />} />
        <Route path="/quizzes" element={<QuizListPage />} />
        <Route path="/quizzes/:id" element={<QuizDetailPage />} />
        <Route path="/create" element={<CreateQuizPage />} />
        <Route path="*" element={<Navigate to="/quizzes" replace />} />
      </Routes>
    </Suspense>
  </Layout>
);

export default App;
