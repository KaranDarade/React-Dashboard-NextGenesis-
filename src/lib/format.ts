const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return "$0.00";
  return currencyFormatter.format(value);
}

/**
 * Demo display currency. DummyJSON prices are USD; the storefront shows INR at
 * a fixed demo rate so the catalogue reads like a real store. These are
 * demonstration values, not live exchange rates or real market prices.
 */
export const DEMO_USD_TO_INR = 84;

export function toInr(usd: number): number {
  return (Number.isFinite(usd) ? usd : 0) * DEMO_USD_TO_INR;
}

export function formatPrice(usd: number): string {
  const inr = toInr(usd);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: inr >= 1000 ? 0 : 2,
  }).format(inr);
}

export function formatCompactPrice(usd: number): string {
  const inr = toInr(usd);
  if (inr >= 1_00_00_000) return `₹${(inr / 1_00_00_000).toFixed(1)}Cr`;
  if (inr >= 1_00_000) return `₹${(inr / 1_00_000).toFixed(1)}L`;
  if (inr >= 1_000) return `₹${(inr / 1_000).toFixed(1)}K`;
  return `₹${Math.round(inr)}`;
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

export function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number, digits = 0): string {
  return `${(Number.isFinite(value) ? value : 0).toFixed(digits)}%`;
}
