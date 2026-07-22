import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Новости — Imperium Motors",
};

export const dynamic = "force-dynamic";

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "long" }).format(d);
}

export default async function NewsListPage() {
  const items = await prisma.news.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 lg:py-16">
      <header className="mb-10">
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-green">
          Новости
        </p>
        <h1 className="font-display mt-2 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.025em] text-carbon">
          Новости компании
        </h1>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center rounded-[20px] border border-[var(--hairline)] bg-card px-6 py-20 text-center shadow-[var(--shadow-rest)]">
          <h2 className="font-display text-[20px] font-semibold text-carbon">
            Пока нет новостей
          </h2>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-taupe">
            Загляните позже — здесь появятся новости компании.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((n, i) => (
            <Reveal key={n.id} delay={(i % 3) * 90} className="h-full">
              <Link
                href={`/news/${n.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[var(--hairline)] bg-card shadow-[var(--shadow-rest)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
              >
                {n.coverImage && (
                  <div className="relative h-[180px] w-full overflow-hidden">
                    <Image
                      src={n.coverImage}
                      alt={n.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <p className="text-[12px] text-taupe">{formatDate(n.publishedAt)}</p>
                  <h3 className="font-display text-[19px] font-semibold leading-snug text-carbon">
                    {n.title}
                  </h3>
                  <p className="mt-1 line-clamp-3 text-[14px] leading-relaxed text-taupe">
                    {n.excerpt}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </main>
  );
}
