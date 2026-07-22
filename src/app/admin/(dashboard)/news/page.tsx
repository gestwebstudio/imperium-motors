import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { deleteNews, togglePublish } from "./actions";

export const dynamic = "force-dynamic";

function formatDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(d);
}

export default async function AdminNewsListPage() {
  await verifySession();
  const items = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-[24px] font-bold text-carbon">Новости</h1>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center rounded-full bg-green px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-green-deep"
        >
          + Добавить новость
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-8 text-[14px] text-taupe">Новостей пока нет.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[20px] border border-[var(--hairline)] bg-card">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-[var(--hairline)] text-[12px] uppercase tracking-wide text-taupe">
                <th className="px-5 py-3 font-medium">Заголовок</th>
                <th className="px-5 py-3 font-medium">Статус</th>
                <th className="px-5 py-3 font-medium">Опубликовано</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((n) => (
                <tr key={n.id} className="border-b border-[var(--hairline)] last:border-0">
                  <td className="px-5 py-3">
                    <Link href={`/admin/news/${n.id}`} className="text-carbon hover:text-green">
                      {n.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] ${
                        n.status === "published"
                          ? "bg-green/10 text-green"
                          : "bg-porcelain text-taupe"
                      }`}
                    >
                      {n.status === "published" ? "Опубликовано" : "Черновик"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-taupe">{formatDate(n.publishedAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <form action={togglePublish.bind(null, n.id)}>
                        <button
                          type="submit"
                          className="text-[13px] text-taupe transition-colors hover:text-carbon"
                        >
                          {n.status === "published" ? "Снять с публикации" : "Опубликовать"}
                        </button>
                      </form>
                      <form action={deleteNews.bind(null, n.id)}>
                        <button
                          type="submit"
                          className="text-[13px] text-[#b04a4a] transition-colors hover:text-[#8a3838]"
                        >
                          Удалить
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
