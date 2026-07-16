import Link from "next/link";
import { BRANDS } from "@/lib/site";

// Бесконечная лента брендов. Список дублируется, трек уезжает на -50% — шов незаметен.
export default function BrandMarquee() {
  const items = [...BRANDS, ...BRANDS];
  return (
    <div className="group relative flex overflow-hidden border-y border-white/10 bg-carbon py-7">
      {/* мягкие края */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-carbon to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-carbon to-transparent" />
      <div className="marquee-track flex shrink-0 items-center gap-16 pr-16">
        {items.map((b, i) => (
          <Link
            key={`${b}-${i}`}
            href={`/catalog?brand=${encodeURIComponent(b)}`}
            className="font-display shrink-0 text-[26px] font-semibold uppercase tracking-[0.08em] text-porcelain/30 transition-colors duration-300 hover:text-porcelain"
          >
            {b}
          </Link>
        ))}
      </div>
    </div>
  );
}
