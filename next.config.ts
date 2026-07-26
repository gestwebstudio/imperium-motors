import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Фиксируем корень проекта (рядом есть второй lockfile в домашней папке).
  turbopack: { root: __dirname },
  images: {
    // Фото авто приходят из 1С с произвольных хостов — отключаем
    // оптимизацию, чтобы не вести белый список доменов.
    unoptimized: true,
  },
  // Главная — статическая кит-версия (public/ui-kit/home.html). Отдаём её на
  // "/" через rewrite (URL остаётся "/"). Старую React-страницу удалили.
  async rewrites() {
    return [{ source: "/", destination: "/ui-kit/home.html" }];
  },
};

export default nextConfig;
