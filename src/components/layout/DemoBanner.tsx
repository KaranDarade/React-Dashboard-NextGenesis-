import { SparklesIcon } from "@/components/shell/icons";

export function DemoBanner() {
  return (
    <div className="glass flex items-center justify-center gap-2 border-x-0 border-t-0 px-4 py-1.5 text-center text-[11px] text-ink-700">
      <SparklesIcon className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
      <span>
        Live data from DummyJSON. Add, edit and delete changes are stored in this
        browser only.
      </span>
    </div>
  );
}
