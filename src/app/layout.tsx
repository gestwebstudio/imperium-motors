import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Imperium Motors — параллельный импорт автомобилей в Москве",
  description:
    "Параллельный импорт премиальных автомобилей с юридической чистотой на выгодных условиях. BMW, Mercedes-Benz, Porsche, Land Rover, Toyota — в наличии и под заказ.",
  openGraph: {
    title: "Imperium Motors — параллельный импорт с юридической чистотой",
    description:
      "Премиальные автомобили в наличии и под заказ. Полный пакет документов, кредит, лизинг, trade-in.",
    type: "website",
    locale: "ru_RU",
  },
};

// Заранее подгружаем основные подмножества (сайт русскоязычный).
const PRELOAD = [
  "/fonts/wixmadefor-cyrillic.woff2",
  "/fonts/wixmadefor-latin.woff2",
  "/fonts/onest-cyrillic.woff2",
  "/fonts/onest-latin.woff2",
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <head>
        {PRELOAD.map((href) => (
          <link
            key={href}
            rel="preload"
            href={href}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
