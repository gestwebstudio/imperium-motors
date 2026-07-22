import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/session";

// Централизованная проверка сессии для страниц/Server Actions админки.
// cache() — чтобы за один render-проход cookie декодировался один раз.
export const verifySession = cache(async () => {
  const session = await readSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
});
