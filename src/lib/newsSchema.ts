import { z } from "zod";

// Браузеры отдают переносы строк из <textarea> как \r\n — приводим
// к \n сразу на входе, чтобы не думать об этом при рендере/экспорте.
const normalizeNewlines = (s: string) => s.replace(/\r\n/g, "\n");

export const newsInput = z.object({
  title: z.string().min(3, "Минимум 3 символа").max(200),
  excerpt: z.string().min(1, "Обязательное поле").max(400).transform(normalizeNewlines),
  body: z.string().min(1, "Обязательное поле").transform(normalizeNewlines),
  coverImage: z.union([z.string().url(), z.literal("")]).optional(),
});

export type NewsInput = z.infer<typeof newsInput>;
