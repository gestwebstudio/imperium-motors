import type { Metadata } from "next";
import { FINANCE } from "@/lib/site";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Покупателям — Imperium Motors",
  description:
    "Кредит с онлайн-одобрением, лизинг, trade-in и выкуп автомобилей на выгодных условиях.",
};

export default function BuyersPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 lg:py-20">
      <header className="max-w-2xl">
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-green">
          Покупателям
        </p>
        <h1 className="font-display mt-3 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.025em] text-carbon text-balance">
          Кредит, лизинг, trade-in и выкуп
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-carbon/70">
          Поможем купить автомобиль на удобных условиях и выгодно расстаться со
          старым. Оставьте заявку — менеджер рассчитает условия под вас.
        </p>
      </header>

      {/* Тёмный бенто услуг */}
      <div className="relative mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        {FINANCE.map((f) => (
          <a
            key={f.source}
            href="#zayavka"
            className="group relative flex min-h-[168px] flex-col justify-between overflow-hidden rounded-[20px] border border-white/10 bg-green-deep p-7 text-porcelain transition-colors duration-300 hover:border-white/25"
          >
            <span aria-hidden="true" className="font-display pointer-events-none absolute -right-4 bottom-2 select-none text-[70px] font-bold uppercase leading-none tracking-[-0.03em] text-white/[0.045]">
              Imperium
            </span>
            <div className="relative">
              <h2 className="font-display text-[21px] font-semibold tracking-[-0.01em] text-white">
                {f.title}
              </h2>
              <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-porcelain/65">
                {f.blurb}
              </p>
            </div>
            <span className="relative mt-8 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 group-hover:border-white/40 group-hover:bg-white/5">
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        ))}
      </div>

      {/* Заявка */}
      <section id="zayavka" className="mt-16 scroll-mt-20 lg:mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] font-bold tracking-[-0.02em] text-carbon text-balance">
              Оставьте заявку
            </h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-carbon/70">
              Выберите тему обращения — кредит, лизинг, trade-in или выкуп — и мы
              перезвоним в течение 15 минут.
            </p>
          </div>
          <div className="rounded-[24px] border border-[var(--hairline)] bg-card p-7 shadow-[var(--shadow-rest)] lg:p-9">
            <LeadForm />
          </div>
        </div>
      </section>
    </main>
  );
}
