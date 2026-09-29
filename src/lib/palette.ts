/**
 * Muted, product-appropriate chart palette with emerald as the primary accent.
 * Most categories read as soft neutrals so the accent stays valuable.
 */
export const CHART_COLORS = [
  "#22c55e",
  "#4ade80",
  "#A7B8AD",
  "#64746A",
  "#3F4A43",
  "#064e3b",
  "#60a5fa",
  "#fbbf24",
];

export function colorAt(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}
