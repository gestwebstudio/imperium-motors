import Link from "next/link";
import Wordmark from "./Wordmark";
import { CONTACTS, NAV } from "@/lib/site";

export default function Footer() {
  return (
    <footer id="contact" className="relative z-[1] scroll-mt-20 bg-carbon text-porcelain">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Wordmark className="text-[22px] text-white" />
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-porcelain/60">
              Параллельный импорт премиальных автомобилей с юридической
              чистотой. Москва.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={CONTACTS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-4 py-1.5 text-[13px] text-porcelain/80 transition-colors hover:border-white/40 hover:text-white"
              >
                Telegram
              </a>
              <a
                href={CONTACTS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-4 py-1.5 text-[13px] text-porcelain/80 transition-colors hover:border-white/40 hover:text-white"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="text-[14px]">
            <p className="text-[13px] text-taupe">Навигация</p>
            <ul className="mt-3 flex flex-col gap-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-porcelain/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-[14px]">
            <p className="text-[13px] text-taupe">Связаться</p>
            <a
              href={CONTACTS.phonePrimary.href}
              className="font-display mt-3 block text-[18px] font-semibold tabular-nums text-white transition-colors hover:text-green tnum"
            >
              {CONTACTS.phonePrimary.label}
            </a>
            <a
              href={CONTACTS.phoneSecondary.href}
              className="font-display mt-1 block text-[18px] font-semibold tabular-nums text-white transition-colors hover:text-green tnum"
            >
              {CONTACTS.phoneSecondary.label}
            </a>
            <a
              href={`mailto:${CONTACTS.email}`}
              className="mt-2 block text-porcelain/70 transition-colors hover:text-white"
            >
              {CONTACTS.email}
            </a>
            <p className="mt-4 text-porcelain/70">{CONTACTS.address}</p>
            <p className="mt-1 text-porcelain/60">{CONTACTS.addressExtra}</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-[13px] text-porcelain/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Imperium Motors</span>
          <nav className="flex gap-6">
            <a href="#" className="transition-colors hover:text-porcelain">
              Политика конфиденциальности
            </a>
            <a href="#" className="transition-colors hover:text-porcelain">
              Условия
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
