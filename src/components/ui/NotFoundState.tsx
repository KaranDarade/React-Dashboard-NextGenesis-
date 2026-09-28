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
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center">
      <p className="text-sm font-semibold text-indigo-600">404</p>
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <p className="max-w-md text-sm text-slate-500">{description}</p>
      <Link
        href={backHref}
        className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
      >
        {backLabel}
      </Link>
    </div>
  );
}
