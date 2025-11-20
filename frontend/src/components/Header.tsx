import { NavLink } from 'react-router-dom';

const baseNavClasses =
  'px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900';

const navClassName = ({ isActive }: { isActive: boolean }) =>
  `${baseNavClasses} ${isActive ? 'rounded-full bg-brand-50 text-brand-700' : ''}`;

const AppHeader = () => (
  <header className="border-b border-slate-200 bg-white">
    <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
      <NavLink to="/quizzes" className="text-xl font-semibold text-brand-600">
        Quiz Builder
      </NavLink>
      <nav className="flex gap-2">
        <NavLink to="/quizzes" className={navClassName}>
          Quizzes
        </NavLink>
        <NavLink to="/create" className={navClassName}>
          Create
        </NavLink>
      </nav>
    </div>
  </header>
);

export default AppHeader;
