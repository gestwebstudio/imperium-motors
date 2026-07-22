import type { Metadata } from "next";
import { ADVANTAGES, CONTACTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "О нас — Imperium Motors",
  description:
    "Камерный автосалон параллельного импорта премиальных автомобилей в Москве. Контакты и адрес салона.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 lg:py-20">
      <header className="max-w-2xl">
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-green">
          О нас
        </p>
        <h1 className="font-display mt-3 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.025em] text-carbon text-balance">
          Камерный салон с личным подходом
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-carbon/70">
          Imperium Motors привозит премиальные автомобили по параллельному
          импорту и доводит их до учёта в России. Мы делаем ставку на прозрачные
          сделки, юридическую чистоту и личное сопровождение — от подбора до
          выдачи ключей с вами работает один менеджер.
        </p>
      </header>

      {/* Преимущества */}
      <section className="mt-14 grid gap-x-8 gap-y-10 border-t border-[var(--hairline)] pt-12 sm:grid-cols-2 lg:grid-cols-4">
        {ADVANTAGES.map((a, i) => (
          <div key={a.title}>
            <span className="font-display text-[14px] font-semibold tabular-nums text-green tnum">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="font-display mt-3 text-[18px] font-semibold tracking-[-0.01em] text-carbon">
              {a.title}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-carbon/65">
              {a.body}
            </p>
          </div>
        ))}
      </section>

      {/* Контакты и адрес */}
      <section className="mt-16 grid gap-8 border-t border-[var(--hairline)] pt-12 md:grid-cols-2 lg:mt-20">
        <div>
          <h2 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-carbon">
            Салон
          </h2>
          <p className="mt-4 text-[16px] text-carbon/75">{CONTACTS.address}</p>
          <p className="mt-1 text-[15px] text-taupe">{CONTACTS.addressExtra}</p>
          <div className="mt-6 flex gap-3">
            <a href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--hairline)] px-4 py-1.5 text-[14px] text-carbon transition-colors hover:border-taupe">
              Telegram
            </a>
            <a href={CONTACTS.whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--hairline)] px-4 py-1.5 text-[14px] text-carbon transition-colors hover:border-taupe">
              WhatsApp
            </a>
          </div>
        </div>
        <div>
          <h2 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-carbon">
            Связаться
          </h2>
          <a href={CONTACTS.phonePrimary.href} className="font-display mt-4 block text-[22px] font-semibold tabular-nums text-carbon transition-colors hover:text-green tnum">
            {CONTACTS.phonePrimary.label}
          </a>
          <a href={CONTACTS.phoneSecondary.href} className="font-display mt-1 block text-[22px] font-semibold tabular-nums text-carbon transition-colors hover:text-green tnum">
            {CONTACTS.phoneSecondary.label}
          </a>
          <a href={`mailto:${CONTACTS.email}`} className="mt-3 block text-[15px] text-taupe transition-colors hover:text-carbon">
            {CONTACTS.email}
          </a>
        </div>
      </section>

      {/* Слот под карту (Фаза 2 / реальные данные) */}
      <div className="mt-10 flex h-64 items-center justify-center rounded-[20px] border border-dashed border-[var(--hairline)] bg-porcelain/50 text-[14px] text-taupe">
        Здесь будет карта проезда
      </div>
    </main>
  );
}
