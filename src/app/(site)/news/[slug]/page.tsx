import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getNews(slug: string) {
  const news = await prisma.news.findUnique({ where: { slug } });
  if (!news || news.status !== "published") return null;
  return news;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNews(slug);
  if (!news) return {};
  return {
    title: `${news.title} — Imperium Motors`,
    description: news.excerpt,
  };
}

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "long" }).format(d);
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await getNews(slug);
  if (!news) notFound();

  const paragraphs = news.body.split(/\n{2,}/).filter(Boolean);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12 lg:py-16">
      <Link href="/news" className="text-[13px] text-taupe hover:text-carbon">
        ← Все новости
      </Link>

      <p className="mt-6 text-[13px] text-taupe">{formatDate(news.publishedAt)}</p>
      <h1 className="font-display mt-2 text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-[-0.02em] text-carbon">
        {news.title}
      </h1>

      {news.coverImage && (
        <div className="relative mt-8 h-[320px] w-full overflow-hidden rounded-[20px]">
          <Image src={news.coverImage} alt={news.title} fill unoptimized className="object-cover" />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 text-[16px] leading-relaxed text-carbon/90">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </main>
  );
}
