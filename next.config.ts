import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Фиксируем корень проекта (рядом есть второй lockfile в домашней папке).
  turbopack: { root: __dirname },
  images: {
    // Фото авто приходят из 1С с произвольных хостов — отключаем
    // оптимизацию, чтобы не вести белый список доменов.
    unoptimized: true,
  },
};

export default nextConfig;
