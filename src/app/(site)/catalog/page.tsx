"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Breadcrumbs, BreadcrumbsItem } from "@heroui/react";
import { type CarCardData } from "@/components/CarCard";
import CatalogCarCard from "./CatalogCarCard";
import SortSelect, { type SortKey } from "./SortSelect";
import FilterPanel, { type Chip } from "./FilterPanel";
import type { Range } from "./RangeFilter";
import {
  makePage,
  TOTAL_COUNT,
  FILTER_GROUPS,
  PRICE_MIN,
  PRICE_MAX,
  POWER_MIN,
  POWER_MAX,
} from "./mock";

const PER_PAGE = 9;
const MAX_PAGES = 6;

function sortCars(list: CarCardData[], sort: SortKey): CarCardData[] {
  if (sort === "price_asc") return [...list].sort((a, b) => a.price - b.price);
  if (sort === "price_desc") return [...list].sort((a, b) => b.price - a.price);
  return list;
}

const powerNum = (car: CarCardData) =>
  parseInt(String(car.power ?? "").replace(/\D/g, ""), 10) || 0;

// Поля color/body в моке нет — по ним не фильтруем (чип всё равно показывается).
function matches(
  car: CarCardData,
  sel: Record<string, string[]>,
  price: Range,
  power: Range
): boolean {
  if (sel.brand?.length && !sel.brand.includes(car.brand)) return false;
  if (sel.model?.length && !sel.model.some((m) => car.model.includes(m))) return false;
  if (sel.transmission?.length && car.transmission && !sel.transmission.includes(car.transmission)) return false;
  if (sel.drive?.length && car.drive && !sel.drive.includes(car.drive)) return false;
  if (sel.fuel?.length && car.fuel && !sel.fuel.includes(car.fuel)) return false;
  if (car.price < price[0] || car.price > price[1]) return false;
  const pw = powerNum(car);
  if (pw < power[0] || pw > power[1]) return false;
  return true;
}

const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/\s/g, " ");

export default function CatalogPage() {
  const [cars, setCars] = useState<CarCardData[]>(() => makePage(0, PER_PAGE));
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<SortKey>("popular");
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [price, setPrice] = useState<Range>([PRICE_MIN, PRICE_MAX]);
  const [power, setPower] = useState<Range>([POWER_MIN, POWER_MAX]);

  const pageRef = useRef(0);
  const busyRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    if (busyRef.current) return;
    const next = pageRef.current + 1;
    if (next >= MAX_PAGES) return;
    busyRef.current = true;
    pageRef.current = next;
    setCars((cur) => [...cur, ...makePage(next, PER_PAGE)]);
    setPage(next);
    requestAnimationFrame(() => {
      busyRef.current = false;
    });
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  const hasMore = page < MAX_PAGES - 1;

  const displayCars = useMemo(
    () => sortCars(cars.filter((c) => matches(c, selected, price, power)), sort),
    [cars, selected, price, power, sort]
  );

  // Чипы выбранных фильтров: по одному на группу + цена/мощность при сужении.
  const chips: Chip[] = useMemo(() => {
    const out: Chip[] = [];
    for (const g of FILTER_GROUPS) {
      const vals = selected[g.id];
      if (vals?.length) out.push({ key: g.id, label: vals.join(", ") });
    }
    if (price[0] > PRICE_MIN || price[1] < PRICE_MAX)
      out.push({ key: "price", label: `${fmt(price[0])}–${fmt(price[1])} ₽` });
    if (power[0] > POWER_MIN || power[1] < POWER_MAX)
      out.push({ key: "power", label: `${power[0]}–${power[1]} л.с.` });
    return out;
  }, [selected, price, power]);

  const onGroupChange = (groupId: string, values: string[]) =>
    setSelected((s) => ({ ...s, [groupId]: values }));

  const onRemoveChip = (key: string) => {
    if (key === "price") setPrice([PRICE_MIN, PRICE_MAX]);
    else if (key === "power") setPower([POWER_MIN, POWER_MAX]);
    else setSelected((s) => ({ ...s, [key]: [] }));
  };

  const onReset = () => {
    setSelected({});
    setPrice([PRICE_MIN, PRICE_MAX]);
    setPower([POWER_MIN, POWER_MAX]);
  };

  return (
    <main className="mx-auto w-full max-w-[1400px] px-6 py-10 lg:py-12">
      {/* Крошки */}
      <Breadcrumbs
        separator={
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        className="mb-6 flex items-center gap-1 text-[14px] leading-[18px] text-[#8f8579]"
      >
        <BreadcrumbsItem href="/" className="text-[#8f8579] transition-colors hover:text-carbon">
          Главная
        </BreadcrumbsItem>
        <BreadcrumbsItem className="text-carbon">Каталог</BreadcrumbsItem>
      </Breadcrumbs>

      {/* Заголовок + бейдж + сортировка */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.16] text-carbon">
            Автомобили в наличии
          </h1>
          <span className="inline-flex items-center rounded-full bg-[#dcdfef] px-2.5 py-1.5 text-[18px] leading-[24px] text-[#5262c0]">
            {TOTAL_COUNT}
          </span>
        </div>
        <SortSelect value={sort} onChange={setSort} />
      </header>

      {/* Две колонки: фильтры (sticky) + карточки */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
        <FilterPanel
          groups={FILTER_GROUPS}
          selected={selected}
          onGroupChange={onGroupChange}
          price={price}
          onPriceChange={setPrice}
          priceMin={PRICE_MIN}
          priceMax={PRICE_MAX}
          power={power}
          onPowerChange={setPower}
          powerMin={POWER_MIN}
          powerMax={POWER_MAX}
          chips={chips}
          onRemoveChip={onRemoveChip}
          onReset={onReset}
        />

        <div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
            {displayCars.map((car) => (
              <CatalogCarCard key={car.id} car={car} />
            ))}
          </div>

          {displayCars.length === 0 && (
            <p className="py-16 text-center text-[15px] text-[#8f8579]">
              Ничего не найдено — измените фильтры.
            </p>
          )}

          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-10 text-[13px] text-[#8f8579]">
              Загружаем ещё…
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
