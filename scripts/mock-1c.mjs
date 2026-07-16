// Имитация выгрузки из 1С. Шлёт тот же JSON, что будет слать реальная 1С,
// на эндпоинт импорта. Запуск:  node scripts/mock-1c.mjs
//
// Так можно проверить весь путь «1С → сайт» ещё до того, как 1С готова.

const URL = process.env.SITE_URL ?? "http://localhost:3000/api/import/cars";
const TOKEN = process.env.IMPORT_TOKEN ?? "dev-secret-change-me";
const HOST = process.env.SITE_ORIGIN ?? "http://localhost:3000";

const payload = {
  mode: "full",
  cars: [
    {
      vin: "WDC1671561A100001",
      brand: "Mercedes-Benz",
      model: "GLS 450 4MATIC",
      year: 2026,
      status: "in_stock",
      price: 17290000,
      currency: "RUB",
      specs: {
        fuel: "Бензин",
        drive: "Полный привод",
        transmission: "Автомат",
        acceleration: "5,8 с",
        power: "375 л.с.",
        max_speed: "209 км/ч",
      },
      photos: [`${HOST}/cars/glc-450.png`],
    },
    {
      vin: "WDC1671561A100002",
      brand: "Mercedes-Benz",
      model: "GLE 350 de 4MATIC",
      year: 2025,
      status: "reserved",
      price: 12450000,
      currency: "RUB",
      specs: {
        fuel: "Гибрид",
        drive: "Полный привод",
        transmission: "Автомат",
        acceleration: "6,8 с",
        power: "333 л.с.",
        max_speed: "210 км/ч",
      },
      photos: [`${HOST}/cars/generic.png`],
    },
    {
      vin: "WDC1671561A100003",
      brand: "Mercedes-Benz",
      model: "G 63 AMG",
      year: 2026,
      status: "in_stock",
      price: 29900000,
      currency: "RUB",
      specs: {
        fuel: "Бензин",
        drive: "Полный привод",
        transmission: "Автомат",
        acceleration: "4,5 с",
        power: "585 л.с.",
        max_speed: "220 км/ч",
      },
      photos: [`${HOST}/cars/generic.png`],
    },
  ],
};

const res = await fetch(URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
  body: JSON.stringify(payload),
});

console.log("HTTP", res.status);
console.log(await res.json());
