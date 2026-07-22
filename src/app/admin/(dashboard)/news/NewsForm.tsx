"use client";

import { useRef, useState } from "react";
import { useActionState } from "react";
import Image from "next/image";
import type { NewsFormState } from "./actions";
import RichTextEditor from "@/components/admin/editor/RichTextEditor";

type Action = (state: NewsFormState, formData: FormData) => Promise<NewsFormState>;

function CoverImageField({ defaultValue }: { defaultValue?: string | null }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не удалось загрузить");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить картинку");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-[13px] text-taupe">Обложка (необязательно)</label>
      <input type="hidden" name="coverImage" value={url} readOnly />

      <div className="mt-1.5 flex items-center gap-4">
        {url ? (
          <div className="relative h-20 w-32 overflow-hidden rounded-xl border border-[var(--hairline)] bg-porcelain">
            <Image src={url} alt="Обложка" fill unoptimized className="object-cover" />
          </div>
        ) : (
          <div className="flex h-20 w-32 items-center justify-center rounded-xl border border-dashed border-[var(--hairline)] text-[12px] text-taupe">
            Нет обложки
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center rounded-full border border-[var(--hairline)] px-4 py-1.5 text-[13px] text-carbon/80 transition-colors hover:border-taupe hover:text-carbon disabled:opacity-50"
          >
            {uploading ? "Загружаем…" : url ? "Заменить" : "Загрузить картинку"}
          </button>
          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="text-left text-[13px] text-[#b04a4a] hover:text-[#8a3838]"
            >
              Убрать обложку
            </button>
          )}
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handlePick} />
      {error && <p className="mt-1 text-[13px] text-[#b04a4a]">{error}</p>}
    </div>
  );
}

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

      <CoverImageField defaultValue={defaultValues?.coverImage} />

      <div>
        <label className="block text-[13px] text-taupe">Текст новости</label>
        <div className="mt-1.5">
          <RichTextEditor name="body" defaultValue={defaultValues?.body} />
        </div>
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
