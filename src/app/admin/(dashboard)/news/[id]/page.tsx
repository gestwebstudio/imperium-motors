import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import NewsForm from "../NewsForm";
import { updateNews } from "../actions";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await verifySession();
  const { id } = await params;
  const news = await prisma.news.findUnique({ where: { id: Number(id) } });
  if (!news) notFound();

  const action = updateNews.bind(null, news.id);

  return (
    <div>
      <Link href="/admin/news" className="text-[13px] text-taupe hover:text-carbon">
        ← Все новости
      </Link>
      <h1 className="font-display mt-3 text-[24px] font-bold text-carbon">
        Редактировать новость
      </h1>

      <div className="mt-6 max-w-2xl rounded-[20px] border border-[var(--hairline)] bg-card p-6">
        <NewsForm
          action={action}
          submitLabel="Сохранить"
          defaultValues={{
            title: news.title,
            excerpt: news.excerpt,
            body: news.body,
            coverImage: news.coverImage,
          }}
        />
      </div>
    </div>
  );
}
