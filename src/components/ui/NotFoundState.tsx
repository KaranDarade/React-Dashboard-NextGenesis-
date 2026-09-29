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
      <p className="text-sm font-semibold text-brand">404</p>
      <h1 className="text-xl font-semibold text-fg">{title}</h1>
      <p className="max-w-md text-sm text-fg-2">{description}</p>
      <Link
        href={backHref}
        className="focus-brand mt-2 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-brand-darker transition hover:bg-brand-bright"
      >
        {backLabel}
      </Link>
    </div>
  );
}
