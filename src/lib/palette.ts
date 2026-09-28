export const CHART_COLORS = [
  "#6366f1",
  "#06b6d4",
  "#8b5cf6",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export function colorAt(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}
