import { SparklesIcon } from "@/components/shell/icons";
import { cn } from "@/lib/format";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-white shadow-[0_10px_24px_-10px_rgba(79,70,229,0.9)]",
        className,
      )}
    >
      <SparklesIcon className="h-5 w-5" />
    </span>
  );
}
