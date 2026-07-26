"use client";

import RangeFilter, { type Range } from "./RangeFilter";
import FilterAccordion, { type FilterGroup } from "./FilterAccordion";

export type Chip = { key: string; label: string };

export default function FilterPanel({
  groups,
  selected,
  onGroupChange,
  price,
  onPriceChange,
  priceMin,
  priceMax,
  power,
  onPowerChange,
  powerMin,
  powerMax,
  chips,
  onRemoveChip,
  onReset,
}: {
  groups: FilterGroup[];
  selected: Record<string, string[]>;
  onGroupChange: (groupId: string, values: string[]) => void;
  price: Range;
  onPriceChange: (r: Range) => void;
  priceMin: number;
  priceMax: number;
  power: Range;
  onPowerChange: (r: Range) => void;
  powerMin: number;
  powerMax: number;
  chips: Chip[];
  onRemoveChip: (key: string) => void;
  onReset: () => void;
}) {
  return (
    <aside className="sticky top-6 flex max-h-[calc(100vh-3rem)] flex-col gap-6 self-start overflow-y-auto overscroll-contain rounded-[30px] bg-white/60 p-[30px]">
      {/* Блок выбранных категорий — только если что-то выбрано */}
      {chips.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            <p className="text-[24px] font-medium leading-[30px] text-carbon">
              Выбранные категории
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <span
                  key={c.key}
                  className="inline-flex items-center gap-1.5 rounded-[26px] bg-[rgba(144,138,134,0.15)] px-2 py-1 text-[14px] leading-[18px] text-[#6a6259]"
                >
                  {c.label}
                  <button
                    type="button"
                    aria-label={`Убрать фильтр: ${c.label}`}
                    onClick={() => onRemoveChip(c.key)}
                    className="inline-flex text-[#6a6259] transition-colors hover:text-carbon"
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center rounded-[30px] border border-[#b2a79b] px-3 py-[5px] text-[14px] leading-[18px] text-carbon transition-colors hover:bg-porcelain"
              >
                Очистить
              </button>
            </div>
          </div>
          <hr className="border-0 border-t border-[var(--hairline)]" />
        </>
      )}

      {/* Фильтры */}
      <div className="flex flex-col gap-4">
        <p className="text-[24px] font-medium leading-[30px] text-carbon">Фильтры</p>
        <div className="flex flex-col gap-[30px]">
          <RangeFilter
            label="Цена, ₽"
            min={priceMin}
            max={priceMax}
            step={100_000}
            value={price}
            onChange={onPriceChange}
          />
          <FilterAccordion groups={groups} selected={selected} onChange={onGroupChange} />
          <RangeFilter
            label="Мощность, л.с."
            min={powerMin}
            max={powerMax}
            step={10}
            value={power}
            onChange={onPowerChange}
          />
        </div>
      </div>
    </aside>
  );
}
