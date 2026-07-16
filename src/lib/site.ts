// Единый источник контента сайта (реальные данные imperiummotors.ru).
// Меняется здесь — обновляется на всех страницах.

export const CONTACTS = {
  phonePrimary: { href: "tel:+74997041444", label: "+7 499 704-14-44" },
  phoneSecondary: { href: "tel:+74951064882", label: "+7 495 106-48-82" },
  email: "info@imperiummotors.ru",
  telegram: "https://telegram.me/Vladislav_imperium_motors",
  whatsapp: "https://wa.me/79250158725",
  address: "Москва, Кутузовский проспект, 48",
  addressExtra: "Паркинг P1, ТЦ «Времена года»",
} as const;

export const NAV = [
  { href: "/catalog", label: "Автомобили в наличии" },
  { href: "/brands", label: "Бренды" },
  { href: "/buyers", label: "Покупателям" },
  { href: "/about", label: "О нас" },
] as const;

export const BRANDS = [
  "BMW",
  "Mercedes-Benz",
  "Porsche",
  "Land Rover",
  "Toyota",
] as const;

// Коллекции. Плитки ведут на /catalog?collection=slug (фильтр — Фаза 2).
export const COLLECTIONS = [
  { slug: "exclusive", title: "Эксклюзив", blurb: "Единичные экземпляры" },
  { slug: "popular", title: "Популярные", blurb: "Самые востребованные модели" },
  { slug: "electric", title: "Электро", blurb: "Электромобили и гибриды" },
  { slug: "sport", title: "Спорткары", blurb: "Заряженные и спортивные" },
  { slug: "business", title: "Бизнес-класс", blurb: "Представительские седаны" },
  { slug: "new", title: "Новинки", blurb: "Свежие поступления" },
] as const;

// Финансовые услуги. У каждой — свой source для заявки.
export const FINANCE = [
  {
    source: "credit",
    title: "Кредитный калькулятор",
    blurb: "Оставьте заявку на онлайн-одобрение кредита",
  },
  {
    source: "trade-in",
    title: "Trade-in",
    blurb: "Узнайте стоимость вашего автомобиля в зачёт нового",
  },
  {
    source: "leasing",
    title: "Расчёт лизинга",
    blurb: "Подберём подходящую лизинговую программу",
  },
  {
    source: "buyback",
    title: "Выкуп автомобилей",
    blurb: "Купим ваш автомобиль на самых выгодных условиях",
  },
] as const;

// «О компании» — тезисы (экспертиза, поддержка, подбор, доставка).
export const ADVANTAGES = [
  {
    title: "Юридическая чистота",
    body: "Полный пакет документов, растаможка и ПТС — автомобиль сразу можно поставить на учёт.",
  },
  {
    title: "Поддержка 24/7",
    body: "На связи в любое время в Telegram и WhatsApp — от подбора до выдачи.",
  },
  {
    title: "Быстрый подбор",
    body: "Найдём и привезём нужную модель под заказ, если её нет в наличии.",
  },
  {
    title: "Доставка по России",
    body: "Доставим автомобиль в ваш город с полным сопровождением сделки.",
  },
] as const;
