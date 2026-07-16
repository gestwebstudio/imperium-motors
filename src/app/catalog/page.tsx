import { prisma } from "@/lib/prisma";
import CarCard from "@/components/CarCard";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic"; // всегда свежий каталог из БД

// Русское склонение существительного после числа.
function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}

export default async function CatalogPage() {
  const cars = await prisma.car.findMany({
    where: { status: { not: "sold" } },
    orderBy: { updatedAt: "desc" },
    include: { photos: { orderBy: { sort: "asc" } } },
  });

  const inStock = cars.filter((c) => c.status === "in_stock").length;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 lg:py-16">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-green">
            Каталог
          </p>
          <h1 className="font-display mt-2 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.025em] text-carbon">
            Автомобили в наличии
          </h1>
        </div>
        <p className="text-[14px] text-taupe">
          {`${cars.length} ${plural(
            cars.length,
            "автомобиль",
            "автомобиля",
            "автомобилей"
          )}${inStock > 0 ? ` · ${inStock} свободно` : ""} · обновляется из 1С`}
        </p>
      </header>

      {cars.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cars.map((car, i) => (
            <Reveal key={car.id} delay={(i % 3) * 90} className="h-full">
              <CarCard car={car} index={i} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-[20px] border border-[var(--hairline)] bg-card px-6 py-20 text-center shadow-[var(--shadow-rest)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-porcelain">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 13l2-5.5A2 2 0 017 6h10a2 2 0 011.9 1.5L21 13m-18 0v4a1 1 0 001 1h1a1 1 0 001-1v-1h10v1a1 1 0 001 1h1a1 1 0 001-1v-4m-18 0h18M6.5 16h.01M17.5 16h.01"
                stroke="var(--taupe)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="font-display mt-5 text-[20px] font-semibold text-carbon">
            Каталог наполняется
          </h2>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-taupe">
            Автомобили появятся здесь, как только придут из&nbsp;1С.
          </p>
        </div>
      )}
    </main>
  );
}
