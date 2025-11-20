import TailSpinLoader from './TailSpinLoader';

interface LoadingMessageProps {
  text?: string;
}

const LoadingMessage = ({ text = 'Loading…' }: LoadingMessageProps) => (
  <div className="flex flex-col items-center gap-3 text-sm text-slate-500">
    <TailSpinLoader />
    <span>{text}</span>
  </div>
);

export default LoadingMessage;
