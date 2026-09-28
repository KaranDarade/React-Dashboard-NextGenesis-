export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="glass-2 flex flex-col items-center justify-center gap-3 rounded-2xl border-rose-200/70 px-6 py-12 text-center"
    >
      <p className="text-base font-semibold text-rose-700">
        Something went wrong
      </p>
      <p className="max-w-md text-sm text-rose-600/90">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
