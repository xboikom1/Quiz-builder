interface ErrorNoticeProps {
  message: string;
}

const ErrorNotice = ({ message }: ErrorNoticeProps) => (
  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
    {message}
  </div>
);

export default ErrorNotice;
