import { test, expect } from "@playwright/test";

const HOME = "/ui-kit/home.html";

test.describe("Главная — Hero (блок 1)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HOME);
  });

  test("заголовок из трёх строк: одна обычная, две жирные", async ({ page }) => {
    const spans = page.locator(".hero__title > *");
    await expect(spans).toHaveCount(3);
    await expect(spans.nth(0)).toHaveCSS("font-weight", "400");
    await expect(spans.nth(1)).toHaveCSS("font-weight", "800");
    await expect(spans.nth(2)).toHaveCSS("font-weight", "800");
    // каждая строка на своей строке (три разных top)
    const tops = await page.$$eval(".hero__title > *", (els) =>
      els.map((e) => Math.round(e.getBoundingClientRect().top))
    );
    expect(new Set(tops).size).toBe(3);
  });

  test("карточка авто показывает модель, статус, цену и 4 тега", async ({ page }) => {
    await expect(page.locator("[data-hero-model]")).toHaveText("Porsche 911 turbo S");
    await expect(page.locator("[data-hero-status]")).toHaveText("В наличии");
    await expect(page.locator("[data-hero-price]")).toHaveText("17 290 000 ₽");
    await expect(page.locator("[data-hero-tags] .tag")).toHaveCount(4);
    await expect(page.locator("[data-hero-indicator]")).toHaveAttribute("data-color", "success");
  });

  test("тэглайн прижат к правому краю и отцентрован по правому краю", async ({ page }) => {
    const m = await page.evaluate(() => {
      const el = document.querySelector(".hero__tagline") as HTMLElement;
      const b = el.querySelector("b")!.getBoundingClientRect();
      const s = el.querySelector("span")!.getBoundingClientRect();
      return {
        align: getComputedStyle(el).textAlign,
        boxRight: Math.round(el.getBoundingClientRect().right),
        bRight: Math.round(b.right),
        sRight: Math.round(s.right),
      };
    });
    expect(m.align).toBe("right");
    // все строки flush к правому краю блока (одинаковый right)
    expect(Math.abs(m.bRight - m.boxRight)).toBeLessThanOrEqual(1);
    expect(Math.abs(m.sRight - m.boxRight)).toBeLessThanOrEqual(1);
  });

  test("логотип марки в карточке — из /home/logos и прижат к левому краю", async ({ page }) => {
    const m = await page.evaluate(() => {
      const img = document.querySelector("[data-hero-logo]") as HTMLImageElement;
      const title = document.querySelector("[data-hero-model]") as HTMLElement;
      return {
        src: img.getAttribute("src") || "",
        loaded: img.complete && img.naturalWidth > 0,
        imgLeft: Math.round(img.getBoundingClientRect().left),
        titleLeft: Math.round(title.getBoundingClientRect().left),
      };
    });
    expect(m.src).toMatch(/\/home\/logos\/porsche\.webp$/);
    expect(m.loaded).toBe(true);
    // логотип по левому краю, вровень с названием (как в кит-карточке)
    expect(Math.abs(m.imgLeft - m.titleLeft)).toBeLessThanOrEqual(1);
  });

  test("ровно 4 характеристики и 2 полоски слайдера (2 машины)", async ({ page }) => {
    await expect(page.locator(".hero-stat")).toHaveCount(4);
    await expect(page.locator(".hero__slider .slider")).toHaveCount(2);
    await expect(page.locator(".hero-stat__value").first()).toHaveText("5,8 с");
  });

  test("кнопка «дальше» переключает на вторую машину и обратно (цикл)", async ({ page }) => {
    await page.locator("[data-hero-next]").click();
    await expect(page.locator("[data-hero-price]")).toHaveText("18 450 000 ₽");
    await expect(page.locator("[data-hero-status]")).toHaveText("Под заказ");
    await expect(page.locator("[data-hero-indicator]")).toHaveAttribute("data-color", "warning");
    await expect(page.locator(".hero-stat__value").first()).toHaveText("2,7 с");
    await expect(page.locator("[data-hero-car]")).toHaveAttribute("src", /2big\.webp/);

    await page.locator("[data-hero-next]").click();
    await expect(page.locator("[data-hero-price]")).toHaveText("17 290 000 ₽");
    await expect(page.locator("[data-hero-car]")).toHaveAttribute("src", /1big\.webp/);
  });

  test("кнопка «назад» тоже переключает машину", async ({ page }) => {
    await page.locator("[data-hero-prev]").click();
    await expect(page.locator("[data-hero-price]")).toHaveText("18 450 000 ₽");
  });

  test("нет горизонтального переполнения", async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1
    );
    expect(overflow).toBe(false);
  });
});

test.describe("Главная — слайдер hero (эффект заполнения)", () => {
  // с обычным motion (без reduce), чтобы полоска реально анимировалась
  test.use({ reducedMotion: "no-preference" });

  test("полоска не залита сразу и заполняется со временем", async ({ page }) => {
    await page.goto(HOME, { waitUntil: "domcontentloaded" });
    const scaleOf = () =>
      page
        .locator(".hero__slider .slider__fill")
        .first()
        .evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);

    const start = await scaleOf();
    // не «сразу зелёная» (была бы 1); заполнение идёт от неполного
    expect(start, "полоска не должна быть залита сразу").toBeLessThan(0.9);
    await page.waitForTimeout(1200);
    const later = await scaleOf();
    expect(later, "полоска должна заполняться").toBeGreaterThan(start + 0.1);
  });

  test("в слайдере ровно 2 полоски (две машины)", async ({ page }) => {
    await page.goto(HOME);
    await expect(page.locator(".hero__slider .slider")).toHaveCount(2);
  });
});

test.describe("Главная — логотипы (блок 2)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HOME);
  });

  const order = () =>
    Array.from(document.querySelectorAll("[data-brands-track] .brand-card img")).map(
      (i) => (i as HTMLImageElement).alt
    );

  test("шесть марок, включая Audi", async ({ page }) => {
    const brands = await page.evaluate(order);
    expect(brands).toEqual(["BMW", "Mercedes-Benz", "Lexus", "Ferrari", "Rolls-Royce", "Audi"]);
  });

  test("видно ровно 5 логотипов, шестой скрыт, первый не под стрелкой", async ({ page }) => {
    const m = await page.evaluate(() => {
      const vp = document.querySelector(".brands__viewport")!.getBoundingClientRect();
      const cards = Array.from(document.querySelectorAll(".brands__track .brand-card"));
      const prev = document.querySelector(".brands__nav--prev")!.getBoundingClientRect();
      return {
        fullyVisible: cards.filter((c) => c.getBoundingClientRect().right <= vp.right + 1).length,
        sixthHidden: cards[5].getBoundingClientRect().left >= vp.right - 2,
        firstNotUnderArrow: cards[0].getBoundingClientRect().left >= prev.right - 1,
      };
    });
    expect(m.fullyVisible).toBe(5);
    expect(m.sixthHidden).toBe(true);
    expect(m.firstNotUnderArrow).toBe(true);
  });

  test("кнопки листают вперёд и назад", async ({ page }) => {
    const before = await page.evaluate(order);

    await page.locator("[data-brands-next]").click();
    await page.waitForTimeout(600);
    const afterNext = await page.evaluate(order);
    expect(afterNext[afterNext.length - 1]).toBe(before[0]); // первая марка уехала в конец

    await page.locator("[data-brands-prev]").click();
    await page.waitForTimeout(600);
    const afterPrev = await page.evaluate(order);
    expect(afterPrev).toEqual(before);
  });

  test("прокрутка бесконечная: 6 шагов вперёд возвращают исходный порядок", async ({ page }) => {
    const head = () =>
      page.evaluate(
        () =>
          (document.querySelector("[data-brands-track] .brand-card img") as HTMLImageElement).alt
      );
    const before = await page.evaluate(order);
    for (let i = 0; i < 6; i++) {
      const prevHead = await head();
      await page.locator("[data-brands-next]").click();
      // ждём завершения ротации (первая карточка сменилась), а не фикс. паузу
      await expect.poll(head).not.toBe(prevHead);
    }
    const after = await page.evaluate(order);
    expect(after).toEqual(before);
  });
});

test.describe("Главная — изображения и CTA", () => {
  test("все картинки загрузились и в формате webp", async ({ page }) => {
    await page.goto(HOME);
    const imgs = await page.evaluate(() =>
      Array.from(document.images).map((i) => ({
        src: i.getAttribute("src") || "",
        ok: i.complete && i.naturalWidth > 0,
      }))
    );
    expect(imgs.length).toBeGreaterThan(0);
    for (const img of imgs) {
      expect(img.ok, `не загрузилась: ${img.src}`).toBe(true);
      expect(img.src, `не webp: ${img.src}`).toMatch(/\.webp(\?|$)/);
    }
  });

  test("CTA-кнопка на hover заливается зелёным на всю ширину", async ({ page }) => {
    await page.goto(HOME);
    const cta = page.locator(".cta-button").first();
    // в покое зелёный слой (::before) — круг 46px справа
    const rest = await cta.evaluate((el) => parseFloat(getComputedStyle(el, "::before").width));
    expect(rest).toBeGreaterThan(40);
    expect(rest).toBeLessThan(60);
    // на hover слой = вся ширина кнопки (reducedMotion делает это мгновенно)
    const btn = await cta.evaluate((el) => el.getBoundingClientRect().width);
    await cta.hover();
    await expect
      .poll(() => cta.evaluate((el) => parseFloat(getComputedStyle(el, "::before").width)), {
        timeout: 3000,
      })
      .toBeGreaterThan(btn - 10);
  });
});
