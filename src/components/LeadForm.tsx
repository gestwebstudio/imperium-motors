"use client";

import { useState, type FormEvent } from "react";
import { FINANCE } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

const TOPICS = [
  { value: "callback", label: "Обратный звонок" },
  ...FINANCE.map((f) => ({ value: f.source, label: f.title })),
];

function digits(s: string) {
  return s.replace(/\D/g, "");
}

export default function LeadForm({
  defaultTopic = "callback",
}: {
  defaultTopic?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    const next: typeof errors = {};
    if (name.length < 2) next.name = "Укажите имя";
    if (digits(phone).length < 10) next.phone = "Укажите корректный телефон";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("submitting");
    try {
      // TODO (Фаза-бэкенд): заменить на fetch("/api/leads", { method: "POST", ... })
      await new Promise((r) => setTimeout(r, 700));
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green/20 bg-green/[0.06] p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green/12">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="var(--green)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="font-display mt-4 text-[18px] font-semibold text-carbon">
          Заявка принята
        </p>
        <p className="mt-1.5 text-[14px] text-taupe">
          Перезвоним в течение 15 минут в рабочее время.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-[14px] font-medium text-green transition-colors hover:text-green-deep"
        >
          Отправить ещё одну
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-name" className="text-[13px] text-taupe">
            Имя
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            className="rounded-xl border border-[var(--hairline)] bg-card px-4 py-3 text-[15px] text-carbon outline-none transition-colors placeholder:text-taupe/60 focus:border-green"
            placeholder="Как к вам обращаться"
          />
          {errors.name && (
            <span className="text-[12px] text-[#b04a4a]">{errors.name}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-phone" className="text-[13px] text-taupe">
            Телефон
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            className="rounded-xl border border-[var(--hairline)] bg-card px-4 py-3 text-[15px] text-carbon outline-none transition-colors placeholder:text-taupe/60 focus:border-green"
            placeholder="+7 900 000-00-00"
          />
          {errors.phone && (
            <span className="text-[12px] text-[#b04a4a]">{errors.phone}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lead-topic" className="text-[13px] text-taupe">
          Тема обращения
        </label>
        <select
          id="lead-topic"
          name="topic"
          defaultValue={defaultTopic}
          className="rounded-xl border border-[var(--hairline)] bg-card px-4 py-3 text-[15px] text-carbon outline-none transition-colors focus:border-green"
        >
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lead-message" className="text-[13px] text-taupe">
          Комментарий <span className="text-taupe/60">— необязательно</span>
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={3}
          className="resize-none rounded-xl border border-[var(--hairline)] bg-card px-4 py-3 text-[15px] text-carbon outline-none transition-colors placeholder:text-taupe/60 focus:border-green"
          placeholder="Интересующая модель, бюджет, вопрос"
        />
      </div>

      {status === "error" && (
        <p className="text-[13px] text-[#b04a4a]">
          Не удалось отправить. Попробуйте ещё раз или позвоните нам.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-1 inline-flex items-center justify-center rounded-full bg-green px-6 py-3.5 text-[15px] font-medium text-white transition-[background-color,transform] duration-200 hover:bg-green-deep active:scale-[0.99] disabled:opacity-70"
      >
        {status === "submitting" ? "Отправляем…" : "Оставить заявку"}
      </button>
      <p className="text-[12px] leading-relaxed text-taupe">
        Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
      </p>
    </form>
  );
}
