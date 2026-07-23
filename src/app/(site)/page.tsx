import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";
import HeroCar from "@/components/site/HeroCar";
import BrandMarquee from "@/components/site/BrandMarquee";
import { ADVANTAGES, COLLECTIONS, CONTACTS, FINANCE } from "@/lib/site";

export const dynamic = "force-dynamic";

// Большой полупрозрачный вотемарк «IMPERIUM MOTORS» — фирменный приём сайта.
function Watermark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`font-display pointer-events-none absolute select-none font-bold uppercase tracking-[-0.03em] ${className}`}
    >
      Imperium Motors
    </span>
  );
}

export default async function HomePage() {
  const cars = await prisma.car.findMany({
    where: { status: { not: "sold" } },
    orderBy: { updatedAt: "desc" },
    include: { photos: { orderBy: { sort: "asc" } } },
  });

  const featured =
    cars.filter((c) => c.status === "in_stock").sort((a, b) => b.price - a.price)[0] ??
    cars[0];

  const priceLabel = featured
    ? `${featured.price.toLocaleString("ru-RU")} ${
        featured.currency === "RUB" ? "₽" : featured.currency
      }`
    : "";

  return (
    <main id="top" className="w-full overflow-x-hidden">
      {/* ── Герой: тёмная кинематографичная сцена ── */}
      <section className="relative min-h-[100dvh] overflow-hidden bg-[#0d100f] text-porcelain">
        {/* Атмосфера: зелёное свечение + верхнее затемнение */}
        <div className="pointer-events-none absolute inset-0">
          <div className="glow-pulse absolute left-1/2 top-1/2 h-[80%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(41,68,52,0.42),transparent_62%)] blur-[130px]" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#0d100f] to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center px-6 pb-16 pt-24 text-center">
          <div className="relative z-10 max-w-4xl">
            <p
              className="line-mask mx-auto mb-6 w-fit"
              style={{ ["--i" as string]: 0 }}
            >
              <span className="inline-flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.22em] text-porcelain/45">
                <span className="h-px w-8 bg-green/60" />
                Автосалон премиум-класса · Москва
              </span>
            </p>
            <h1 className="font-display text-[clamp(2.3rem,5.4vw,4.6rem)] font-bold leading-[1.03] tracking-[-0.03em] text-white">
              <span className="line-mask block">
                <span style={{ ["--i" as string]: 1 }}>Параллельный импорт</span>
              </span>
              <span className="line-mask block">
                <span style={{ ["--i" as string]: 2 }}>
                  с юридической чистотой
                </span>
              </span>
            </h1>
            <p
              className="rise mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-porcelain/60"
              style={{ ["--i" as string]: 4 }}
            >
              Премиальные автомобили в наличии и под заказ — с полным пакетом
              документов, растаможкой и прозрачной ценой.
            </p>
            <div
              className="rise mt-9 flex flex-wrap items-center justify-center gap-3"
              style={{ ["--i" as string]: 5 }}
            >
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-carbon transition-[background-color,transform] duration-200 hover:bg-porcelain active:scale-[0.98]"
              >
                Смотреть каталог
                <span className="font-display tabular-nums tnum">· {cars.length}</span>
              </Link>
              <a
                href="#zayavka"
                className="inline-flex items-center rounded-full border border-white/25 px-7 py-3.5 text-[15px] font-medium text-white transition-colors duration-200 hover:border-white/55"
              >
                Заказать звонок
              </a>
            </div>
          </div>

          {/* Автомобиль */}
          <div className="rise relative mt-4 w-full lg:-mt-2" style={{ ["--i" as string]: 5 }}>
            <HeroCar
              src={featured?.photos[0]?.url}
              alt={featured ? `${featured.brand} ${featured.model}` : "Автомобиль"}
            />
          </div>

          {featured && (
            <p
              className="rise mt-2 font-display text-[14px] text-white"
              style={{ ["--i" as string]: 6 }}
            >
              Флагман · {featured.brand} {featured.model}
              <span className="text-porcelain/45"> — {priceLabel}</span>
            </p>
          )}
        </div>

        {/* Подсказка скролла */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 lg:flex">
          <span className="text-[10px] uppercase tracking-[0.24em] text-porcelain/40">
            Листайте
          </span>
          <svg className="scroll-cue" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-porcelain/50" />
          </svg>
        </div>
      </section>

      {/* ── Лента брендов ── */}
      <BrandMarquee />

      {/* ── Коллекции ── */}
      <div className="mx-auto max-w-6xl px-6">
        <section className="py-24 lg:py-32">
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.8rem)] font-bold tracking-[-0.025em] text-carbon">
              Коллекции
            </h2>
            <p className="hidden text-[14px] text-taupe sm:block">
              Подборки под задачу и настроение
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {COLLECTIONS.map((c, i) => {
              const isWide = c.slug === "new";
              return (
                <Reveal
                  key={c.slug}
                  delay={(i % 3) * 80}
                  className={
                    c.slug === "exclusive"
                      ? "md:col-span-2"
                      : isWide
                      ? "md:col-span-3"
                      : ""
                  }
                >
                  <Link
                    href={`/catalog?collection=${c.slug}`}
                    className={`group relative flex h-full overflow-hidden rounded-2xl border border-[var(--hairline)] bg-card p-6 transition-[transform,box-shadow] duration-400 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] ${
                      isWide
                        ? "flex-col gap-5 md:min-h-[128px] md:flex-row md:items-center md:justify-between"
                        : "min-h-[172px] flex-col justify-between"
                    }`}
                  >
                    {(c.slug === "exclusive" || isWide) && (
                      <Watermark className="-right-6 -top-3 text-[72px] leading-none text-carbon/[0.04]" />
                    )}
                    <div className="relative">
                      <h3 className="font-display text-[20px] font-semibold tracking-[-0.01em] text-carbon">
                        {c.title}
                      </h3>
                      <p className="mt-1.5 text-[14px] text-taupe">{c.blurb}</p>
                    </div>
                    <span
                      className={`relative inline-flex items-center gap-1.5 text-[14px] font-medium text-green ${
                        isWide ? "shrink-0" : "mt-6"
                      }`}
                    >
                      {isWide ? "Все поступления" : "Смотреть"}
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                        <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ── О компании ── */}
        <section className="border-t border-[var(--hairline)] py-24 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.8rem)] font-bold tracking-[-0.025em] text-carbon text-balance">
                Небольшой салон с личным подходом
              </h2>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-carbon/70">
                Привозим автомобили из-за рубежа по параллельному импорту и
                доводим до учёта в России. С вами работает один менеджер — от
                подбора до выдачи ключей.
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-green transition-colors hover:text-green-deep"
              >
                О компании
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
              {ADVANTAGES.map((a, i) => (
                <Reveal key={a.title} delay={(i % 2) * 90}>
                  <div>
                    <span className="font-display text-[14px] font-semibold tabular-nums text-green tnum">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display mt-3 text-[18px] font-semibold tracking-[-0.01em] text-carbon">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-carbon/65">
                      {a.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── Финансовые услуги (тёмный бенто) ── */}
      <section className="relative overflow-hidden bg-carbon py-24 text-porcelain lg:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 max-w-xl">
            <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.8rem)] font-bold tracking-[-0.025em] text-white">
              Финансовые услуги
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-porcelain/60">
              Кредит, лизинг, trade-in и выкуп — оставьте заявку, менеджер
              рассчитает условия под вас.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:auto-rows-[minmax(180px,auto)]">
            {FINANCE.map((f, i) => {
              const tall = f.source === "credit";
              const wide = f.source === "buyback";
              return (
                <Reveal
                  key={f.source}
                  delay={i * 80}
                  className={`h-full ${tall ? "md:row-span-2" : ""} ${wide ? "md:col-span-2" : ""}`}
                >
                  <a
                    href="#zayavka"
                    className="group relative flex h-full min-h-[180px] flex-col justify-between overflow-hidden rounded-[20px] border border-white/10 bg-green-deep p-7 transition-colors duration-300 hover:border-white/25"
                  >
                    <Watermark className="-right-4 bottom-2 text-[70px] leading-none text-white/[0.05]" />
                    <div className="relative">
                      <h3 className="font-display text-[21px] font-semibold tracking-[-0.01em] text-white">
                        {f.title}
                      </h3>
                      <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-porcelain/65">
                        {f.blurb}
                      </p>
                    </div>
                    <span className="relative mt-8 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-[background-color,border-color] duration-300 group-hover:border-white/40 group-hover:bg-white/5">
                      <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                        <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Обратный звонок / заявка ── */}
      <div className="mx-auto max-w-6xl px-6">
        <section id="zayavka" className="scroll-mt-20 py-24 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.8rem)] font-bold tracking-[-0.025em] text-carbon text-balance">
                Оставьте заявку
              </h2>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-carbon/70">
                Перезвоним в течение 15 минут, ответим на вопросы и подберём
                автомобиль. Или свяжитесь удобным способом.
              </p>
              <div className="mt-7 flex flex-col gap-3 text-[15px]">
                <a href={CONTACTS.phonePrimary.href} className="font-display text-[22px] font-semibold tabular-nums text-carbon transition-colors hover:text-green tnum">
                  {CONTACTS.phonePrimary.label}
                </a>
                <div className="flex gap-3">
                  <a href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--hairline)] px-4 py-1.5 text-[14px] text-carbon transition-colors hover:border-taupe">
                    Telegram
                  </a>
                  <a href={CONTACTS.whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--hairline)] px-4 py-1.5 text-[14px] text-carbon transition-colors hover:border-taupe">
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border border-[var(--hairline)] bg-card p-7 shadow-[var(--shadow-rest)] lg:p-9">
              <LeadForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
