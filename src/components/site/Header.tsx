"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Wordmark from "./Wordmark";
import { CONTACTS, NAV } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Тёмный кинематографичный герой только на главной — пока не проскроллили.
  const overHero = pathname === "/" && !scrolled && !open;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        overHero
          ? "border-transparent bg-transparent"
          : "border-[var(--hairline)] bg-page/75 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className={`text-[19px] transition-colors ${overHero ? "text-white" : "text-carbon"}`}
          aria-label="На главную"
        >
          <Wordmark />
        </Link>

        {/* Десктоп-навигация */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[14px] transition-colors ${
                  overHero
                    ? active
                      ? "text-white"
                      : "text-white/55 hover:text-white"
                    : active
                    ? "text-carbon"
                    : "text-taupe hover:text-carbon"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={CONTACTS.phonePrimary.href}
            className={`font-display text-[14px] font-semibold tabular-nums transition-colors tnum ${
              overHero ? "text-white hover:text-porcelain" : "text-carbon hover:text-green"
            }`}
          >
            {CONTACTS.phonePrimary.label}
          </a>
        </nav>

        {/* Мобайл: телефон + гамбургер */}
        <div className="flex items-center gap-4 lg:hidden">
          <a
            href={CONTACTS.phonePrimary.href}
            className={`font-display text-[14px] font-semibold tabular-nums tnum ${
              overHero ? "text-white" : "text-carbon"
            }`}
          >
            {CONTACTS.phonePrimary.label}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              overHero ? "border-white/25 text-white" : "border-[var(--hairline)] text-carbon"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              {open ? (
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {open && (
        <nav className="border-t border-[var(--hairline)] bg-page/95 px-6 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-3 py-2.5 text-[15px] transition-colors ${
                    isActive(item.href)
                      ? "bg-porcelain text-carbon"
                      : "text-carbon/80 hover:bg-porcelain/60"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2 border-t border-[var(--hairline)] pt-4">
            <a
              href={CONTACTS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full border border-[var(--hairline)] py-2 text-center text-[14px] text-carbon"
            >
              Telegram
            </a>
            <a
              href={CONTACTS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full border border-[var(--hairline)] py-2 text-center text-[14px] text-carbon"
            >
              WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
