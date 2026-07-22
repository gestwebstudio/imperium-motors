import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { logout } from "@/app/admin/actions";

const NAV = [{ href: "/admin/news", label: "Новости" }];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  return (
    <div className="min-h-screen bg-page">
      <header className="border-b border-[var(--hairline)] bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-display text-[16px] font-bold text-carbon">
              Imperium Motors <span className="text-taupe">· админка</span>
            </Link>
            <nav className="hidden items-center gap-5 sm:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[14px] text-taupe transition-colors hover:text-carbon"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-[13px] text-taupe sm:inline">{session.name}</span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-[var(--hairline)] px-4 py-1.5 text-[13px] text-carbon/80 transition-colors hover:border-taupe hover:text-carbon"
              >
                Выйти
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
