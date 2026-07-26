"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopover,
  ListBox,
  ListBoxItem,
} from "@heroui/react";

export type SortKey = "popular" | "price_asc" | "price_desc";

// Компактные подписи «Сортировать по: …» (как в макете 578-2006).
export const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "popular", label: "Популярности" },
  { id: "price_asc", label: "Возрастанию цены" },
  { id: "price_desc", label: "Убыванию цены" },
];

export default function SortSelect({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  return (
    <div className="flex items-center gap-2 text-[16px] leading-[20px]">
      {/* Подпись — warm-taupe-400 (макет) */}
      <span className="text-[#8f8579]">Сортировать по:</span>
      <Select
        aria-label="Сортировать по"
        selectedKey={value}
        onSelectionChange={(k) => k && onChange(k as SortKey)}
      >
        {/* Триггер — значение heritage-green, подчёркнутое + маленькая стрелка */}
        <SelectTrigger className="flex items-center gap-1 text-green underline decoration-from-font underline-offset-2 outline-none">
          <SelectValue />
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M1.5 3L4 5.5L6.5 3"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SelectTrigger>
        <SelectPopover className="min-w-[220px] rounded-2xl border border-[var(--hairline)] bg-card p-1.5 shadow-[var(--shadow-hover)]">
          <ListBox className="outline-none">
            {SORT_OPTIONS.map((o) => (
              <ListBoxItem
                key={o.id}
                id={o.id}
                className="cursor-pointer rounded-lg px-3 py-2 text-[15px] text-carbon outline-none data-[focused]:bg-porcelain data-[selected]:font-medium data-[selected]:text-green"
              >
                {o.label}
              </ListBoxItem>
            ))}
          </ListBox>
        </SelectPopover>
      </Select>
    </div>
  );
}
