"use client";

export function SearchBar({
  value,
  onChange,
  loading = false,
}: {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
}) {
  return (
    <div className="relative w-full">
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="none"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      >
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
        <path
          d="m14 14 4 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search products by title or brand..."
        aria-label="Search products"
        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-24 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />
      {loading ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          searching...
        </span>
      ) : null}
    </div>
  );
}
