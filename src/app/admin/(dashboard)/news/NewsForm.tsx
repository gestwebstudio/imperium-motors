"use client";

import { useActionState } from "react";
import type { NewsFormState } from "./actions";

type Action = (state: NewsFormState, formData: FormData) => Promise<NewsFormState>;

export default function NewsForm({
  action,
  submitLabel,
  defaultValues,
}: {
  action: Action;
  submitLabel: string;
  defaultValues?: {
    title: string;
    excerpt: string;
    body: string;
    coverImage: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const errors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="title" className="block text-[13px] text-taupe">
          Заголовок
        </label>
        <input
          id="title"
          name="title"
          defaultValue={defaultValues?.title}
          required
          className="mt-1.5 w-full rounded-xl border border-[var(--hairline)] bg-card px-3.5 py-2.5 text-[14px] text-carbon outline-none focus:border-green"
        />
        {errors.title && <p className="mt-1 text-[13px] text-[#b04a4a]">{errors.title[0]}</p>}
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-[13px] text-taupe">
          Краткое описание (для списка новостей)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={defaultValues?.excerpt}
          required
          className="mt-1.5 w-full rounded-xl border border-[var(--hairline)] bg-card px-3.5 py-2.5 text-[14px] text-carbon outline-none focus:border-green"
        />
        {errors.excerpt && <p className="mt-1 text-[13px] text-[#b04a4a]">{errors.excerpt[0]}</p>}
      </div>

      <div>
        <label htmlFor="coverImage" className="block text-[13px] text-taupe">
          Обложка (URL, необязательно)
        </label>
        <input
          id="coverImage"
          name="coverImage"
          type="url"
          placeholder="https://…"
          defaultValue={defaultValues?.coverImage ?? ""}
          className="mt-1.5 w-full rounded-xl border border-[var(--hairline)] bg-card px-3.5 py-2.5 text-[14px] text-carbon outline-none focus:border-green"
        />
        {errors.coverImage && <p className="mt-1 text-[13px] text-[#b04a4a]">{errors.coverImage[0]}</p>}
      </div>

      <div>
        <label htmlFor="body" className="block text-[13px] text-taupe">
          Текст новости
        </label>
        <textarea
          id="body"
          name="body"
          rows={12}
          defaultValue={defaultValues?.body}
          required
          className="mt-1.5 w-full rounded-xl border border-[var(--hairline)] bg-card px-3.5 py-2.5 text-[14px] leading-relaxed text-carbon outline-none focus:border-green"
        />
        {errors.body && <p className="mt-1 text-[13px] text-[#b04a4a]">{errors.body[0]}</p>}
      </div>

      {state?.error && <p className="text-[13px] text-[#b04a4a]">{state.error}</p>}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full bg-green px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-green-deep disabled:opacity-60"
        >
          {pending ? "Сохраняем…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
