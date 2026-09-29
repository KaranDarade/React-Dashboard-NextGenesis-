"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import {
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/shell/icons";
import { useClickOutside } from "@/hooks/useClickOutside";
import type { Product } from "@/types/product";

export function ProductRowMenu({
  product,
  onDelete,
  align = "right",
}: {
  product: Product;
  onDelete: (product: Product) => void;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside<HTMLDivElement>(close);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Actions for ${product.title}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="focus-brand grid h-8 w-8 place-items-center rounded-lg border border-transparent text-fg-3 transition hover:border-line hover:bg-white/[0.05] hover:text-fg"
      >
        <MoreHorizontalIcon className="h-4 w-4" />
      </button>

      {open ? (
        <div
          role="menu"
          className={`glass-float pop absolute top-[calc(100%+6px)] z-40 w-40 rounded-xl p-1 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <Link
            href={`/products/${product.id}`}
            onClick={close}
            role="menuitem"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-fg-2 transition hover:bg-white/[0.06] hover:text-fg"
          >
            <EyeIcon className="h-4 w-4" />
            View
          </Link>
          <Link
            href={`/products/${product.id}/edit`}
            onClick={close}
            role="menuitem"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-fg-2 transition hover:bg-white/[0.06] hover:text-fg"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              close();
              onDelete(product);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-fg-2 transition hover:bg-danger/10 hover:text-danger"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}
