import { Link } from 'react-router-dom';

interface EmptyStateProps {
  message: string;
  action?: {
    label: string;
    to: string;
  };
}

const EmptyState = ({ message, action }: EmptyStateProps) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
    <p className="text-slate-600">{message}</p>
    {action && (
      <Link
        to={action.to}
        className="mt-4 inline-block rounded-md bg-brand-600 px-4 py-2 text-white shadow-sm hover:bg-brand-700"
      >
        {action.label}
      </Link>
    )}
  </div>
);

export default EmptyState;
