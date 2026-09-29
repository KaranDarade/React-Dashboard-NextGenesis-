import { cn } from "@/lib/format";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-white/[0.06] text-fg-2",
  success: "bg-brand/10 text-brand",
  warning: "bg-warn/10 text-warn",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function stockTone(stock: number): Tone {
  if (stock <= 0) return "danger";
  if (stock < 20) return "warning";
  return "success";
}
