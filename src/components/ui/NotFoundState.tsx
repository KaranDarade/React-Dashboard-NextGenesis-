import Link from "next/link";

export function NotFoundState({
  title = "Product not found",
  description = "We could not find a product with that id.",
  backHref = "/products",
  backLabel = "Back to products",
}: {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="glass flex flex-col items-center justify-center gap-3 rounded-2xl px-6 py-16 text-center">
      <p className="text-sm font-semibold text-indigo-600">404</p>
      <h1 className="text-xl font-semibold text-ink-900">{title}</h1>
      <p className="max-w-md text-sm text-ink-500">{description}</p>
      <Link
        href={backHref}
        className="mt-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_26px_-14px_rgba(79,70,229,0.9)] transition hover:-translate-y-0.5"
      >
        {backLabel}
      </Link>
    </div>
  );
}
