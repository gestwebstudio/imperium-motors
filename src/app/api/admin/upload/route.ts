import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/session";
import { saveUploadedImage } from "@/lib/uploads";

export const runtime = "nodejs";

// Загрузка картинок из админки (обложка новости, вставка в текст).
// Это Route Handler, вызывается через fetch() — redirect() здесь не к месту
// (в отличие от Server Actions/страниц), поэтому проверяем сессию напрямую
// и при отсутствии отвечаем 401 JSON'ом, а не редиректом.
export async function POST(req: NextRequest) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
  }

  try {
    const url = await saveUploadedImage(file, "news");
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Не удалось загрузить файл";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
