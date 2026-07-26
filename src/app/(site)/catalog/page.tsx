"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Breadcrumbs, BreadcrumbsItem } from "@heroui/react";
import CarCard, { type CarCardData } from "@/components/CarCard";
import { makePage, TOTAL_COUNT } from "./mock";
import SortSelect, { type SortKey } from "./SortSelect";

function sortCars(list: CarCardData[], sort: SortKey): CarCardData[] {
  if (sort === "price_asc") return [...list].sort((a, b) => a.price - b.price);
  if (sort === "price_desc") return [...list].sort((a, b) => b.price - a.price);
  return list; // «по популярности» — как загружены (по id)
}

const PER_PAGE = 9;
const MAX_PAGES = 6; // сколько всего «догрузок» доступно (несколько прокруток)

export default function CatalogPage() {
  const [cars, setCars] = useState<CarCardData[]>(() => makePage(0, PER_PAGE));
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<SortKey>("popular");
  const displayCars = useMemo(() => sortCars(cars, sort), [cars, sort]);
  const pageRef = useRef(0);
  const busyRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    // guard: не дать наблюдателю дёрнуть догрузку повторно за один порог
    if (busyRef.current) return;
    const next = pageRef.current + 1;
    if (next >= MAX_PAGES) return;
    busyRef.current = true;
    pageRef.current = next;
    // плоские setState (не вложенные) — иначе StrictMode дублирует аппенд
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
      { rootMargin: "600px 0px" } // подгружаем заранее, до достижения низа
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  const hasMore = page < MAX_PAGES - 1;

  return (
    <main className="mx-auto w-full max-w-[1400px] px-6 py-10 lg:py-12">
      {/* Крошки — из HeroUI */}
      <Breadcrumbs separator="›" className="mb-6 text-[14px] text-taupe">
        <BreadcrumbsItem href="/">Главная</BreadcrumbsItem>
        <BreadcrumbsItem>Каталог</BreadcrumbsItem>
      </Breadcrumbs>

      {/* Заголовок + счётчик + сортировка */}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.025em] text-carbon">
            Автомобили в наличии
          </h1>
          <span className="text-[14px] text-taupe">{TOTAL_COUNT}</span>
        </div>
        <SortSelect value={sort} onChange={setSort} />
      </header>

      {/* Сетка карточек (фильтры — следующим инкрементом) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {displayCars.map((car, i) => (
          <CarCard key={car.id} car={car} index={i} />
        ))}
      </div>

      {/* Сентинел для infinite scroll */}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex justify-center py-10 text-[13px] text-taupe"
        >
          Загружаем ещё…
        </div>
      )}
    </main>
  );
}
