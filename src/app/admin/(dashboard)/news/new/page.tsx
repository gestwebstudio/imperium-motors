import Link from "next/link";
import { verifySession } from "@/lib/dal";
import NewsForm from "../NewsForm";
import { createNews } from "../actions";

export default async function NewNewsPage() {
  await verifySession();

  return (
    <div>
      <Link href="/admin/news" className="text-[13px] text-taupe hover:text-carbon">
        ← Все новости
      </Link>
      <h1 className="font-display mt-3 text-[24px] font-bold text-carbon">Новая новость</h1>

      <div className="mt-6 max-w-2xl rounded-[20px] border border-[var(--hairline)] bg-card p-6">
        <NewsForm action={createNews} submitLabel="Создать" />
      </div>
    </div>
  );
}
