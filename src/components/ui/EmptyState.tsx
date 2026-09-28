import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="glass-2 flex flex-col items-center justify-center gap-2 rounded-2xl border-dashed px-6 py-14 text-center">
      <p className="text-base font-semibold text-ink-900">{title}</p>
      {description ? (
        <p className="max-w-md text-sm text-ink-500">{description}</p>
      ) : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
