"use client";

import { Slider, SliderTrack, SliderFill, SliderThumb } from "@heroui/react";

export type Range = [number, number];

const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/\s/g, " ");
const parse = (s: string) => {
  const d = s.replace(/\D/g, "");
  return d ? parseInt(d, 10) : NaN;
};

// Слайдер цены/мощности: поля ввода (кастомные) над ползунком (HeroUI),
// двусторонняя синхронизация. Диапазон [lo, hi] — источник истины (в page).
export default function RangeFilter({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: Range;
  onChange: (r: Range) => void;
}) {
  const [lo, hi] = value;

  // Поле пустое (виден плейсхолдер-маска), пока значение на краю диапазона.
  const loText = lo > min ? fmt(lo) : "";
  const hiText = hi < max ? fmt(hi) : "";

  const onLo = (s: string) => {
    const n = parse(s);
    const next = Number.isNaN(n) ? min : Math.min(Math.max(n, min), hi);
    onChange([next, hi]);
  };
  const onHi = (s: string) => {
    const n = parse(s);
    const next = Number.isNaN(n) ? max : Math.max(Math.min(n, max), lo);
    onChange([lo, next]);
  };

  return (
    <div className="flex w-full flex-col gap-2.5">
      {/* Заголовок секции — Onest SemiBold 16/20 warm-taupe-400 */}
      <p className="text-[16px] font-semibold leading-[20px] text-[#8f8579]">{label}</p>

      {/* Кастомные поля ввода: h36, border warm-taupe-100 */}
      <div className="flex items-start gap-2">
        <input
          inputMode="numeric"
          value={loText}
          onChange={(e) => onLo(e.target.value)}
          placeholder={`от ${fmt(min)}`}
          aria-label={`${label}: от`}
          className="h-9 min-w-0 flex-1 rounded-lg border border-[#f2eeea] bg-white px-3 text-[14px] leading-[20px] text-carbon outline-none placeholder:text-[#b2a79b] focus:border-[#b2a79b]"
        />
        <input
          inputMode="numeric"
          value={hiText}
          onChange={(e) => onHi(e.target.value)}
          placeholder={`до ${fmt(max)}`}
          aria-label={`${label}: до`}
          className="h-9 min-w-0 flex-1 rounded-lg border border-[#f2eeea] bg-white px-3 text-[14px] leading-[20px] text-carbon outline-none placeholder:text-[#b2a79b] focus:border-[#b2a79b]"
        />
      </div>

      {/* Ползунок HeroUI, стилизован под макет: бар taupe-100, fill green-400,
          бегунки 24×16 белые rounded8 с тенью. */}
      <Slider
        aria-label={label}
        value={[lo, hi]}
        onChange={(v) => onChange(v as Range)}
        minValue={min}
        maxValue={max}
        step={step}
        className="range-slider w-full"
      >
        <SliderTrack className="relative h-5 w-full overflow-hidden rounded-xl">
          <SliderFill className="absolute inset-y-0" />
          <SliderThumb index={0} className="top-1/2 z-10 h-4 w-6 -translate-y-1/2 rounded-lg outline-none" />
          <SliderThumb index={1} className="top-1/2 z-10 h-4 w-6 -translate-y-1/2 rounded-lg outline-none" />
        </SliderTrack>
      </Slider>
    </div>
  );
}
