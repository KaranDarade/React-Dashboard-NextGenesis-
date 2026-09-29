"use client";

import { XIcon } from "@/components/shell/icons";

export interface FilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

export function FilterChips({ chips }: { chips: FilterChip[] }) {
  if (chips.length === 0) return null;

  return (
    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="focus-brand group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-white/[0.04] py-1 pl-3 pr-2 text-[11px] font-medium text-fg-2 transition hover:border-brand/40 hover:text-fg"
        >
          {chip.label}
          <XIcon className="h-3 w-3 text-fg-3 transition group-hover:text-danger" />
        </button>
      ))}
    </div>
  );
}
