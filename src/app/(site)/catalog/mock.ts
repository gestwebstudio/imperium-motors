// Мок-данные каталога (по ТЗ — без БД; форма совпадает с CarCardData,
// чтобы переиспользовать существующий компонент CarCard).
import type { CarCardData } from "@/components/CarCard";

// Диапазоны каталога (для слайдеров цена/мощность).
export const PRICE_MIN = 4_500_000;
export const PRICE_MAX = 50_000_000;
export const POWER_MIN = 100;
export const POWER_MAX = 900;

// Наборы характеристик для фильтров-аккордеона (рандомные по ТЗ).
export const FILTER_GROUPS: { id: string; title: string; options: string[] }[] = [
  { id: "brand", title: "Марка", options: ["BMW", "Mercedes-Benz", "Land Rover", "Lexus", "Porsche", "Audi"] },
  { id: "body", title: "Кузов", options: ["Седан", "Кроссовер", "Внедорожник", "Купе", "Минивэн", "Кабриолет"] },
  { id: "fuel", title: "Топливо", options: ["Бензин", "Дизель", "Гибрид", "Электро"] },
  { id: "drive", title: "Привод", options: ["Полный", "Задний", "Передний"] },
  { id: "transmission", title: "Коробка", options: ["Автомат", "Робот", "Механика"] },
  { id: "year", title: "Год выпуска", options: ["2026", "2025", "2024", "2023"] },
  { id: "color", title: "Цвет", options: ["Чёрный", "Белый", "Серый", "Синий", "Зелёный", "Красный"] },
];

const CARS: Omit<CarCardData, "id">[] = [
  { brand: "BMW", model: "X3 xDrive20i", year: 2026, status: "in_stock", price: 8_990_000, currency: "RUB",
    fuel: "Бензин", drive: "Полный", transmission: "Автомат", acceleration: "7,8 с", power: "300 л.с.", maxSpeed: "215 км/ч",
    photos: [{ url: "/home/catalog/x3.webp" }] },
  { brand: "Mercedes-Benz", model: "CLE AMG 53 4MATIC+", year: 2026, status: "in_stock", price: 13_990_000, currency: "RUB",
    fuel: "Бензин", drive: "Полный", transmission: "Автомат", acceleration: "4,3 с", power: "449 л.с.", maxSpeed: "270 км/ч",
    photos: [{ url: "/home/catalog/cle.webp" }] },
  { brand: "Land Rover", model: "Range Rover SV", year: 2026, status: "in_stock", price: 35_690_000, currency: "RUB",
    fuel: "Бензин", drive: "Полный", transmission: "Автомат", acceleration: "4,6 с", power: "530 л.с.", maxSpeed: "250 км/ч",
    photos: [{ url: "/home/catalog/rangerover.webp" }] },
  { brand: "Lexus", model: "GX Executive", year: 2026, status: "in_stock", price: 15_490_000, currency: "RUB",
    fuel: "Бензин", drive: "Полный", transmission: "Автомат", acceleration: "6,5 с", power: "349 л.с.", maxSpeed: "210 км/ч",
    photos: [{ url: "/home/catalog/gx.webp" }] },
  { brand: "BMW", model: "X5 M60i Sport Pro", year: 2026, status: "reserved", price: 20_390_000, currency: "RUB",
    fuel: "Бензин", drive: "Полный", transmission: "Автомат", acceleration: "4,3 с", power: "530 л.с.", maxSpeed: "250 км/ч",
    photos: [{ url: "/home/catalog/x5.webp" }] },
  { brand: "Mercedes-Benz", model: "V-Класс Exclusive", year: 2025, status: "in_stock", price: 14_490_000, currency: "RUB",
    fuel: "Дизель", drive: "Полный", transmission: "Автомат", acceleration: "9,1 с", power: "237 л.с.", maxSpeed: "220 км/ч",
    photos: [{ url: "/home/catalog/vclass.webp" }] },
  { brand: "Porsche", model: "911 Turbo S", year: 2026, status: "in_stock", price: 28_990_000, currency: "RUB",
    fuel: "Бензин", drive: "Полный", transmission: "Робот", acceleration: "2,7 с", power: "650 л.с.", maxSpeed: "330 км/ч",
    photos: [{ url: "/home/cars/1bignew.webp" }] },
  { brand: "Lexus", model: "LX 600", year: 2024, status: "in_stock", price: 18_900_000, currency: "RUB",
    fuel: "Бензин", drive: "Полный", transmission: "Автомат", acceleration: "6,9 с", power: "409 л.с.", maxSpeed: "210 км/ч",
    photos: [{ url: "/home/catalog/gx.webp" }] },
  { brand: "BMW", model: "7 Series 760i", year: 2025, status: "in_stock", price: 22_490_000, currency: "RUB",
    fuel: "Гибрид", drive: "Полный", transmission: "Автомат", acceleration: "4,2 с", power: "544 л.с.", maxSpeed: "250 км/ч",
    photos: [{ url: "/home/catalog/x5.webp" }] },
];

// Базовый набор с id.
export const BASE_CARS: CarCardData[] = CARS.map((c, i) => ({ ...c, id: i + 1 }));

// Всего «в каталоге» (для счётчика у заголовка) — фиксированное большое число.
export const TOTAL_COUNT = 138;

// Генерация страницы карточек для infinite scroll: циклически берём базовые,
// подставляя новые id и слегка варьируя год/цену, чтобы ряды отличались.
export function makePage(pageIndex: number, perPage = 9): CarCardData[] {
  const out: CarCardData[] = [];
  for (let i = 0; i < perPage; i++) {
    const base = BASE_CARS[(pageIndex * perPage + i) % BASE_CARS.length];
    const id = pageIndex * perPage + i + 1;
    out.push({ ...base, id });
  }
  return out;
}
