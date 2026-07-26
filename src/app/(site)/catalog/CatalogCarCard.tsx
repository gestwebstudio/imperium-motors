"use client";

import { useState } from "react";
import Image from "next/image";
import type { CarCardData } from "@/components/CarCard";

// Бренд → логотип марки (из public). Fallback — без лого.
const BRAND_LOGO: Record<string, string> = {
  BMW: "/home/logos/bmw.webp",
  "Mercedes-Benz": "/home/logos/mercedes.webp",
  "Land Rover": "/home/logos/landrover.webp",
  Lexus: "/home/logos/lexus.webp",
  Porsche: "/home/logos/porsche.webp",
  Audi: "/brand-logos/audi.webp",
};

const STATUS: Record<string, { label: string; waiting: boolean }> = {
  in_stock: { label: "В наличии", waiting: false },
  reserved: { label: "Ожидаем поступления", waiting: true },
  sold: { label: "Продано", waiting: true },
};

function fmt(v: number) {
  return v.toLocaleString("ru-RU").replace(/\s/g, " ");
}

// Иконка избранного/сравнения: 24px, тултип L снизу, переключение по клику.
function IconAction({ kind }: { kind: "wishlist" | "comparison" }) {
  const [on, setOn] = useState(false);
  const idle = kind === "wishlist" ? "Добавить в избранное" : "Добавить в сравнение";
  const active = kind === "wishlist" ? "Убрать из избранного" : "Убрать из сравнения";
  const color = on
    ? kind === "wishlist"
      ? "text-[#c0504a]"
      : "text-green"
    : "text-[#b2a79b]"; // warm-taupe-300

  return (
    <span className="group/ia relative inline-flex">
      <button
        type="button"
        aria-pressed={on}
        aria-label={on ? active : idle}
        onClick={() => setOn((v) => !v)}
        className={`inline-flex size-6 items-center justify-center transition-opacity group-hover/ia:opacity-60 ${color}`}
      >
        {kind === "wishlist" ? (
          <svg viewBox="0 0 12 12" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M6 10.6C3.4 8.7 1.4 6.9 1.4 4.6c0-1.4.9-2.4 2.1-2.4 1 0 1.9.6 2.5 1.6.6-1 1.5-1.6 2.5-1.6 1.2 0 2.1 1 2.1 2.4 0 2.3-2 4.1-4.6 6z" fillOpacity={on ? 1 : 0} />
            <path fillRule="evenodd" clipRule="evenodd" d="M6 3.2c-.6-1-1.5-1.5-2.5-1.5-1.5 0-2.6 1.2-2.6 2.9 0 2.6 2.2 4.6 4.9 6.6l.2.1.2-.1c2.7-2 4.9-4 4.9-6.6 0-1.7-1.1-2.9-2.6-2.9-1 0-1.9.5-2.5 1.5zm0 1.1l.4-.7c.5-.9 1.2-1.3 1.9-1.3 1 0 1.7.8 1.7 2 0 2-1.7 3.7-4 5.5-2.3-1.8-4-3.5-4-5.5 0-1.2.7-2 1.7-2 .7 0 1.4.4 1.9 1.3l.4.7z" />
          </svg>
        ) : (
          <svg viewBox="0 0 12 12" width="18" height="18" fill="currentColor" aria-hidden="true">
            {on ? (
              <>
                <path d="M.7 2.3h5.1c.4 0 .7-.3.7-.7s-.3-.6-.7-.6H.7c-.4 0-.7.3-.7.6 0 .4.3.7.7.7z" />
                <path d="M.7 6.3h3.6c.4 0 .7-.3.7-.6 0-.4-.3-.7-.7-.7H.7c-.4 0-.7.3-.7.7 0 .3.3.6.7.6z" />
                <path d="M10.3 6.9c.2-.2.6-.2.9 0 .2.2.2.6 0 .8L8.5 10.3c-.1.1-.3.2-.4.2-.2 0-.3-.1-.5-.2L6.3 9c-.2-.2-.2-.6 0-.8.2-.2.6-.2.9 0l.9.8 2.2-2.1z" />
              </>
            ) : (
              <>
                <path d="M.7 2.3h6.8c.4 0 .7-.3.7-.7s-.3-.6-.7-.6H.7c-.4 0-.7.3-.7.6 0 .4.3.7.7.7z" />
                <path d="M.7 6.3h6.8c.4 0 .7-.3.7-.6 0-.4-.3-.7-.7-.7H.7c-.4 0-.7.3-.7.7 0 .3.3.6.7.6z" />
                <path d="M.7 10.3h4.6c.4 0 .7-.3.7-.7 0-.3-.3-.6-.7-.6H.7c-.4 0-.7.3-.7.6 0 .4.3.7.7.7z" />
                <path d="M10.5 8.3v-1c0-.4.3-.6.6-.6.4 0 .6.2.6.6v1h1c.4 0 .7.3.7.6 0 .4-.3.7-.7.7h-1v1c0 .3-.2.6-.6.6-.3 0-.6-.3-.6-.6v-1h-1c-.3 0-.6-.3-.6-.7 0-.3.3-.6.6-.6h1z" />
              </>
            )}
          </svg>
        )}
      </button>
      {/* тултип L (14/18, белый, тень popover) — снизу, по правому краю */}
      <span className="pointer-events-none absolute right-0 top-[26px] z-10 whitespace-nowrap rounded-md bg-white px-2.5 py-1 text-[14px] leading-[18px] text-[#898785] opacity-0 shadow-[4px_4px_10px_rgba(106,98,89,0.1)] transition-opacity group-hover/ia:opacity-100">
        {on ? active : idle}
      </span>
    </span>
  );
}

export default function CatalogCarCard({ car }: { car: CarCardData }) {
  const st = STATUS[car.status] ?? STATUS.in_stock;
  const logo = BRAND_LOGO[car.brand];
  const photo = car.photos[0]?.url;
  const tags = [String(car.year), car.power, car.drive].filter(Boolean) as string[];

  return (
    <article className="group relative flex flex-col gap-6 overflow-hidden rounded-[30px] bg-white/60 p-[26px] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-1 hover:shadow-[0.375rem_0.25rem_3.1375rem_rgba(205,197,190,0.5)]">
      {/* контент: gap 10 между шапкой-контентом и фото */}
      <div className="flex flex-col gap-2.5">
        {/* content area: gap 16 */}
        <div className="flex flex-col gap-4">
          {/* лого + иконки */}
          <div className="flex items-center justify-between">
            <span className="inline-flex h-6 items-center">
              {logo && (
                <Image src={logo} alt={car.brand} width={48} height={24} className="h-6 w-auto object-contain" unoptimized />
              )}
            </span>
            <span className="flex items-center gap-4">
              <IconAction kind="wishlist" />
              <IconAction kind="comparison" />
            </span>
          </div>
          {/* инфо: gap 10 */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[24px] font-medium leading-[30px] text-carbon">{car.model}</h3>
            <span className="flex items-center gap-1.5">
              <span className={`size-[7px] rounded-full ${st.waiting ? "bg-[#ddb103]" : "bg-[#55ab4d]"}`} />
              <span className="text-[16px] leading-[20px] text-[#8f8579]">{st.label}</span>
            </span>
            <div className="flex flex-wrap items-center gap-[5px] pt-0.5">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center rounded-[26px] bg-[rgba(143,133,121,0.2)] px-3 py-1 text-[16px] leading-[20px] text-green">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* фото — окно 179px, вписываем по ширине */}
        <div className="relative h-[179px] w-full overflow-hidden">
          {photo ? (
            <Image src={photo} alt={`${car.brand} ${car.model}`} fill sizes="380px" className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#8f8579]">Фото готовится</div>
          )}
        </div>
      </div>

      {/* действие: цена + кнопка */}
      <div className="flex items-end gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-[18px] text-[#898785]">Стоимость автомобиля</p>
          <p className="font-display mt-1 whitespace-nowrap text-[28px] font-extrabold leading-[36px] text-carbon">
            {fmt(car.price)} ₽
          </p>
        </div>
        {st.waiting ? (
          <button className="shrink-0 rounded-[30px] border border-[#b2a79b] px-3.5 py-2 text-[16px] leading-[20px] text-carbon transition-colors hover:bg-porcelain">
            Забронировать
          </button>
        ) : (
          <button className="shrink-0 rounded-[30px] bg-green px-3.5 py-2 text-[16px] leading-[20px] text-white transition-colors hover:bg-green-deep">
            Подробнее
          </button>
        )}
      </div>
    </article>
  );
}
