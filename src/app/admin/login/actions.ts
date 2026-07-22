"use server";

import { redirect } from "next/navigation";
import { verifyCredentials } from "@/lib/auth";
import { createSession } from "@/lib/session";

export type LoginState = { error?: string } | undefined;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Укажите email и пароль" };
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    return { error: "Неверный email или пароль" };
  }

  await createSession({ userId: user.id, email: user.email, name: user.name });
  redirect("/admin");
}
