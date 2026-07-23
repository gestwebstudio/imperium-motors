import { test, expect } from "@playwright/test";

const KIT = "/ui-kit/index.html";

test.describe("UI Kit", () => {
  test("страница кита грузится без ошибок в консоли", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(KIT);
    await expect(page.locator("#cta-button")).toBeVisible();
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("CTA Button показан в ките", async ({ page }) => {
    await page.goto(KIT);
    await expect(page.locator("#cta-button .cta-button")).toHaveCount(2);
  });

  test("Brand Logo Card — 6 марок, логотипы webp", async ({ page }) => {
    await page.goto(KIT);
    const grid = page.locator(".brand-card-grid .brand-card");
    await expect(grid).toHaveCount(6);
    const srcs = await page.$$eval(".brand-card-grid .brand-card__logo", (els) =>
      els.map((e) => (e as HTMLImageElement).getAttribute("src") || "")
    );
    for (const s of srcs) expect(s).toMatch(/\.webp$/);
  });

  test("иконки собраны в спрайт и все <use> находят символ", async ({ page }) => {
    await page.goto(KIT);
    const broken = await page.evaluate(() => {
      const ids = new Set(
        Array.from(document.querySelectorAll(".icon-sprite symbol")).map((s) => s.id)
      );
      return Array.from(document.querySelectorAll("use"))
        .map((u) => (u.getAttribute("href") || "").slice(1))
        .filter((id) => id && !ids.has(id));
    });
    expect(broken).toEqual([]);
  });
});
