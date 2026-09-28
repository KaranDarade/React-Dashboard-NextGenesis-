import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/format";

export type GlassLevel = "panel" | "inset" | "strong" | "float";

const levelClass: Record<GlassLevel, string> = {
  panel: "glass",
  inset: "glass-2",
  strong: "glass-strong",
  float: "glass-float",
};

export function GlassCard({
  level = "panel",
  hover = false,
  className,
  children,
  ...rest
}: {
  level?: GlassLevel;
  hover?: boolean;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        levelClass[level],
        "rounded-2xl",
        hover && "glass-hover",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
