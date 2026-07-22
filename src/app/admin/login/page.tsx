"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-6">
      <div className="w-full max-w-sm rounded-[20px] border border-[var(--hairline)] bg-card p-8 shadow-[var(--shadow-rest)]">
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-green">
          Админка
        </p>
        <h1 className="font-display mt-2 text-[24px] font-bold text-carbon">
          Вход
        </h1>

        <form action={action} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-[13px] text-taupe">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="mt-1.5 w-full rounded-xl border border-[var(--hairline)] bg-page px-3.5 py-2.5 text-[14px] text-carbon outline-none transition-colors focus:border-green"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[13px] text-taupe">
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1.5 w-full rounded-xl border border-[var(--hairline)] bg-page px-3.5 py-2.5 text-[14px] text-carbon outline-none transition-colors focus:border-green"
            />
          </div>

          {state?.error && (
            <p className="text-[13px] text-[#b04a4a]">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-green px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-green-deep disabled:opacity-60"
          >
            {pending ? "Входим…" : "Войти"}
          </button>
        </form>
      </div>
    </main>
  );
}
