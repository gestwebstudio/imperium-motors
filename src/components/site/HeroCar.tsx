"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function HeroCar({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Мягкий параллакс по курсору — прямое управление transform, без ре-рендера.
  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x * 22}px, ${y * 14}px, 0)`;
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative isolate flex items-center justify-center">
      {/* Пятно света */}
      <div className="glow-pulse pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(41,68,52,0.55),rgba(41,68,52,0)_62%)] blur-2xl" />

      <div ref={parallaxRef} className="relative transition-transform duration-300 ease-out">
        <div className="floaty relative">
          {src ? (
            <>
              <Image
                src={src}
                alt={alt}
                width={720}
                height={440}
                priority
                unoptimized
                className="relative z-10 h-auto w-full max-w-[560px] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]"
              />
              {/* Отражение */}
              <Image
                src={src}
                alt=""
                aria-hidden="true"
                width={720}
                height={440}
                unoptimized
                className="pointer-events-none absolute inset-x-0 top-[92%] -z-0 h-auto w-full max-w-[560px] scale-y-[-1] object-contain opacity-25 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.6),transparent_55%)]"
              />
            </>
          ) : (
            <div className="flex h-[280px] w-[520px] max-w-full items-center justify-center rounded-2xl border border-white/10 text-sm text-porcelain/50">
              Фото готовится
            </div>
          )}
        </div>
      </div>

      {/* Тень-«блик» под автомобилем */}
      <div className="pointer-events-none absolute bottom-[8%] left-1/2 h-8 w-[62%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-2xl" />
    </div>
  );
}
