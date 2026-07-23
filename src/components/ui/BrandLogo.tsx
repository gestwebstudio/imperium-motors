import Image from "next/image";

/**
 * Логотип марки. Набор марок будет меняться, поэтому соответствие
 * «название → файл» лежит в одном месте: добавить марку = положить
 * файл в /public/brands и дописать строку в BRAND_LOGOS.
 *
 * Высота задаётся пропорцией из макета (39px в карточке авто),
 * ширина подстраивается: у логотипов разные пропорции —
 * BMW квадратный, Lexus широкий.
 */

export const BRAND_LOGOS: Record<string, string> = {
  bmw: "/brand-logos/bmw.webp",
  mercedes: "/brand-logos/mercedes.webp",
  lexus: "/brand-logos/lexus.webp",
  porsche: "/brand-logos/porsche.webp",
  rollsroyce: "/brand-logos/rollsroyce.webp",
  audi: "/brand-logos/audi.webp",
};

/** Приводим «BMW», «bmw », «Lexus» к ключу словаря. */
function toKey(brand: string) {
  return brand.trim().toLowerCase();
}

export function hasBrandLogo(brand: string) {
  return toKey(brand) in BRAND_LOGOS;
}

export default function BrandLogo({
  brand,
  size = 39,
  className,
}: {
  brand: string;
  /** Высота логотипа в px. Ширина считается по пропорции файла. */
  size?: number;
  className?: string;
}) {
  const src = BRAND_LOGOS[toKey(brand)];

  // Нет файла — не роняем вёрстку и не показываем «битую» картинку:
  // отдаём название марки текстом.
  if (!src) {
    return (
      <span
        className={className}
        style={{ display: "inline-flex", alignItems: "center", height: size }}
        title={brand}
      >
        {brand}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", height: size }}
    >
      <Image
        src={src}
        alt={brand}
        height={size}
        width={size}
        style={{ height: "100%", width: "auto", objectFit: "contain" }}
        unoptimized
      />
    </span>
  );
}
