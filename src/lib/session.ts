import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Сессия админки — stateless JWT в httpOnly-cookie.
// Payload намеренно минимальный: id, имя, email — без пароля/хэша.

const COOKIE_NAME = "admin_session";
const SESSION_TTL = "7d";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET не задан в .env");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: number;
  email: string;
  name: string;
};

async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(secretKey());
}

async function decrypt(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  const token = await encrypt(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + SESSION_TTL_MS),
  });
}

export async function readSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return decrypt(cookieStore.get(COOKIE_NAME)?.value);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
