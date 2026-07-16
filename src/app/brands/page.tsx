import type { Metadata } from "next";
import Link from "next/link";
import { BRANDS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Бренды — Imperium Motors",
  description:
    "BMW, Mercedes-Benz, Porsche, Land Rover, Toyota — привозим по параллельному импорту с юридической чистотой.",
};

export default function BrandsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 lg:py-20">
      <header className="max-w-2xl">
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-green">
          Бренды
        </p>
        <h1 className="font-display mt-3 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.025em] text-carbon text-balance">
          Марки, с которыми работаем
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-carbon/70">
          Привозим автомобили ведущих премиальных марок по параллельному импорту
          — в наличии и под заказ, с полным пакетом документов.
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BRANDS.map((b) => (
          <Link
            key={b}
            href={`/catalog?brand=${encodeURIComponent(b)}`}
            className="group relative flex h-40 flex-col justify-between overflow-hidden rounded-2xl border border-[var(--hairline)] bg-card p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
          >
            <span className="font-display text-[24px] font-bold uppercase tracking-[0.06em] text-carbon/70 transition-colors duration-300 group-hover:text-carbon">
              {b}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-green">
              Смотреть в наличии
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
