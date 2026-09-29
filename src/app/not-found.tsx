import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-sm font-semibold text-brand">404</p>
      <h1 className="text-2xl font-semibold tracking-tight text-fg">
        Page not found
      </h1>
      <p className="max-w-sm text-sm text-fg-2">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="focus-brand mt-2 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-brand-darker transition hover:bg-brand-bright"
      >
        Back to dashboard
      </Link>
    </main>
  );
}
