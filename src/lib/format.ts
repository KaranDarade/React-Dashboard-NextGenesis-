const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return "$0.00";
  return currencyFormatter.format(value);
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function rangeText({
  skip,
  count,
  total,
}: {
  skip: number;
  count: number;
  total: number;
}): string {
  if (total <= 0 || count <= 0) return "No results";
  const start = skip + 1;
  const end = skip + count;
  return `Showing ${start}-${end} of ${total}`;
}

export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
