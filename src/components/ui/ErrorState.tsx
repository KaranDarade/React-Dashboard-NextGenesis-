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
      className="glass-2 flex flex-col items-center justify-center gap-3 rounded-2xl border-danger/25 px-6 py-12 text-center"
    >
      <p className="text-base font-semibold text-danger">
        Something went wrong
      </p>
      <p className="max-w-md text-sm text-fg-2">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="focus-brand mt-1 rounded-xl bg-danger px-4 py-2 text-sm font-medium text-canvas transition hover:brightness-110"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
