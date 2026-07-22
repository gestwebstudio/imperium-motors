import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Оптимистичная проверка перед рендером: пускает в /admin/** только с
// валидной cookie-сессией. Секретную проверку (что юзер ещё существует
// и т.п.) делает verifySession()/каждый Server Action на своей стороне —
// см. lib/dal.ts. Сюда лезть в БД нельзя (proxy — не место для этого).

const COOKIE_NAME = "admin_session";

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.SESSION_SECRET));
    return true;
  } catch {
    return false;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    // уже залогинен — не показываем форму логина второй раз
    if (await hasValidSession(request)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!(await hasValidSession(request))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
