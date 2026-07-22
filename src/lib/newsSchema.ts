import { z } from "zod";

// Браузеры отдают переносы строк из <textarea> как \r\n — приводим
// к \n сразу на входе, чтобы не думать об этом при рендере/экспорте.
const normalizeNewlines = (s: string) => s.replace(/\r\n/g, "\n");

// body приходит из rich-text редактора уже HTML-строкой. "<p></p>" —
// пустой документ, поэтому проверяем реальное содержимое без тегов.
const hasContent = (html: string) => html.replace(/<[^>]*>/g, "").trim().length > 0;

export const newsInput = z.object({
  title: z.string().min(3, "Минимум 3 символа").max(200),
  excerpt: z.string().min(1, "Обязательное поле").max(400).transform(normalizeNewlines),
  body: z.string().refine(hasContent, "Добавьте текст новости"),
  // Свой загруженный файл (/uploads/...) или, на будущее, внешняя ссылка.
  coverImage: z
    .union([
      z.string().refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v)),
      z.literal(""),
    ])
    .optional(),
});

export type NewsInput = z.infer<typeof newsInput>;
