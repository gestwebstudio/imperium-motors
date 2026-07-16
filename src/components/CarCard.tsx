import Image from "next/image";

// Данные карточки (то, что каталог берёт из БД).
export type CarCardData = {
  id: number;
  brand: string;
  model: string;
  year: number;
  status: string; // in_stock | reserved | sold
  price: number;
  currency: string;
  fuel?: string | null;
  drive?: string | null;
  transmission?: string | null;
  acceleration?: string | null;
  power?: string | null;
  maxSpeed?: string | null;
  photos: { url: string }[];
};

const STATUS: Record<string, { label: string; dot: string }> = {
  in_stock: { label: "В наличии", dot: "bg-green" },
  reserved: { label: "Забронировано", dot: "bg-taupe" },
  sold: { label: "Продано", dot: "bg-[#b04a4a]" },
};

function formatPrice(value: number) {
  // Неразрывные пробелы между разрядами, чтобы число не ломалось.
  return value.toLocaleString("ru-RU").replace(/\s/g, " ");
}

export default function CarCard({
  car,
  index = 0,
}: {
  car: CarCardData;
  index?: number;
}) {
  const status = STATUS[car.status] ?? STATUS.in_stock;
  const photo = car.photos[0]?.url;
  const currencySign = car.currency === "RUB" ? "₽" : car.currency;
  const available = car.status === "in_stock";

  const tags = [car.fuel, car.drive, car.transmission].filter(
    Boolean
  ) as string[];

  const metrics = [
    { val: car.acceleration, lbl: "Разгон 0–100" },
    { val: car.power, lbl: "Мощность" },
    { val: car.maxSpeed, lbl: "Макс. скорость" },
  ].filter((m) => m.val);

  return (
    <article
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-[var(--hairline)] bg-card shadow-[var(--shadow-rest)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
    >
      {/* шапка: марка, модель, статус, год + характеристики */}
      <div className="flex flex-col gap-3 px-7 pt-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-taupe">
              {car.brand}
            </p>
            <h3 className="font-display mt-1 text-[22px] font-semibold leading-[1.12] tracking-[-0.01em] text-carbon text-balance">
              {car.model}
            </h3>
          </div>
          <span className="mt-1 shrink-0 font-display text-[15px] font-semibold tabular-nums text-taupe tnum">
            {car.year}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${status.dot} ${
              available ? "ring-4 ring-green/12" : ""
            }`}
          />
          <span className="text-[13px] text-taupe">{status.label}</span>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-lg border border-[var(--hairline)] bg-porcelain/60 px-2.5 py-1 text-[12px] leading-none text-carbon/80"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* фото — «студийная» подложка + зум на ховере */}
      <div className="relative mx-5 mt-6 h-[194px] overflow-hidden rounded-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_42%,var(--porcelain),transparent_72%)]" />
        {/* мягкая тень-«блик» под автомобилем */}
        <div className="pointer-events-none absolute inset-x-8 bottom-5 h-6 rounded-[50%] bg-carbon/10 blur-xl" />
        {photo ? (
          <Image
            src={photo}
            alt={`${car.brand} ${car.model}`}
            fill
            className="relative object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            sizes="(max-width: 768px) 90vw, 380px"
            priority={index < 3}
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-taupe">
            Фото готовится
          </div>
        )}
      </div>

      {/* характеристики */}
      {metrics.length > 0 && (
        <div className="mx-5 mt-5 grid grid-cols-3 gap-1.5">
          {metrics.map((m) => (
            <div
              key={m.lbl}
              className="rounded-xl bg-porcelain px-3 py-2.5"
            >
              <p className="font-display whitespace-nowrap text-[17px] font-bold leading-tight tracking-[-0.01em] text-carbon tnum">
                {m.val}
              </p>
              <p className="mt-0.5 text-[11px] leading-tight text-taupe">
                {m.lbl}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* цена + CTA */}
      <div className="mt-auto flex items-end justify-between gap-4 px-7 pb-7 pt-6">
        <div className="min-w-0">
          <p className="text-[12px] text-taupe">Стоимость</p>
          <p className="font-display mt-0.5 whitespace-nowrap text-[27px] font-bold leading-none tracking-[-0.015em] text-carbon tnum">
            {formatPrice(car.price)}
            <span className="ml-1 text-taupe">{currencySign}</span>
          </p>
        </div>

        {available ? (
          <a
            href="#contact"
            className="group/btn inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green px-5 py-2.5 text-[13px] font-medium text-white transition-[background-color,transform] duration-200 hover:bg-green-deep active:scale-[0.97]"
          >
            Купить
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
            >
              <path
                d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        ) : (
          <a
            href="#contact"
            className="inline-flex shrink-0 items-center rounded-full border border-[var(--hairline)] bg-transparent px-4 py-2.5 text-[13px] font-medium text-carbon/80 transition-colors duration-200 hover:border-taupe hover:text-carbon"
          >
            Оставить заявку
          </a>
        )}
      </div>
    </article>
  );
}
