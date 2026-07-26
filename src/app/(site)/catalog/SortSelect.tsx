"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectIndicator,
  SelectPopover,
  ListBox,
  ListBoxItem,
} from "@heroui/react";

export type SortKey = "popular" | "price_asc" | "price_desc";

export const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "popular", label: "По популярности" },
  { id: "price_asc", label: "По возрастанию цены" },
  { id: "price_desc", label: "По убыванию цены" },
];

export default function SortSelect({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  return (
    <Select
      aria-label="Сортировка"
      selectedKey={value}
      onSelectionChange={(k) => k && onChange(k as SortKey)}
      className="min-w-[240px]"
    >
      <SelectTrigger className="flex w-full items-center justify-between gap-2 rounded-full border border-[var(--hairline)] bg-card px-4 py-2.5 text-[14px] text-carbon shadow-[var(--shadow-rest)] transition-colors hover:border-taupe">
        <SelectValue />
        <SelectIndicator />
      </SelectTrigger>
      <SelectPopover className="rounded-2xl border border-[var(--hairline)] bg-card p-1.5 shadow-[var(--shadow-hover)]">
        <ListBox className="outline-none">
          {SORT_OPTIONS.map((o) => (
            <ListBoxItem
              key={o.id}
              id={o.id}
              className="cursor-pointer rounded-lg px-3 py-2 text-[14px] text-carbon outline-none data-[focused]:bg-porcelain data-[selected]:font-medium data-[selected]:text-green"
            >
              {o.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </SelectPopover>
    </Select>
  );
}
