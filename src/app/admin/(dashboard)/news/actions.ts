"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { newsInput } from "@/lib/newsSchema";
import { slugify } from "@/lib/slug";
import { sanitizeNewsHtml } from "@/lib/sanitizeNewsHtml";

export type NewsFormState = { error?: string; fieldErrors?: Record<string, string[]> } | undefined;

async function uniqueSlug(base: string, ignoreId?: number) {
  const root = slugify(base) || "novost";
  let candidate = root;
  let n = 2;
  // Ищем свободный слаг, добавляя -2, -3... при коллизии.
  while (
    await prisma.news.findFirst({
      where: { slug: candidate, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
    })
  ) {
    candidate = `${root}-${n++}`;
  }
  return candidate;
}

function parseForm(formData: FormData) {
  return newsInput.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    coverImage: formData.get("coverImage") ?? "",
  });
}

export async function createNews(_state: NewsFormState, formData: FormData): Promise<NewsFormState> {
  await verifySession();

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { title, excerpt, body, coverImage } = parsed.data;
  const slug = await uniqueSlug(title);

  const news = await prisma.news.create({
    data: { title, excerpt, body: sanitizeNewsHtml(body), coverImage: coverImage || null, slug },
  });

  revalidatePath("/admin/news");
  redirect(`/admin/news/${news.id}`);
}

export async function updateNews(id: number, _state: NewsFormState, formData: FormData): Promise<NewsFormState> {
  await verifySession();

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) return { error: "Новость не найдена" };

  const { title, excerpt, body, coverImage } = parsed.data;
  // Слаг пересчитываем только если поменялся заголовок — не ломаем ссылки зря.
  const slug = title === existing.title ? existing.slug : await uniqueSlug(title, id);

  await prisma.news.update({
    where: { id },
    data: { title, excerpt, body: sanitizeNewsHtml(body), coverImage: coverImage || null, slug },
  });

  revalidatePath("/admin/news");
  revalidatePath(`/news/${slug}`);
  redirect("/admin/news");
}

export async function deleteNews(id: number) {
  await verifySession();
  const news = await prisma.news.delete({ where: { id } });
  revalidatePath("/admin/news");
  revalidatePath(`/news/${news.slug}`);
}

export async function togglePublish(id: number) {
  await verifySession();
  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) return;

  const nextStatus = news.status === "published" ? "draft" : "published";
  await prisma.news.update({
    where: { id },
    data: {
      status: nextStatus,
      publishedAt: nextStatus === "published" ? new Date() : news.publishedAt,
    },
  });

  revalidatePath("/admin/news");
  revalidatePath(`/news/${news.slug}`);
  revalidatePath("/news");
}
