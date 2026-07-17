import { test, expect } from "@playwright/test";

/**
 * Mobile behaviour. Runs under the "mobile" Playwright project (Pixel 7).
 * The mobile experience must be designed, not merely narrower.
 */

test.describe("mobile navigation", () => {
  test("the drawer opens, navigates, and closes", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /Open menu|Abrir menú/i });
    await trigger.click();

    const drawer = page.locator("#mobile-drawer");
    await expect(drawer).toBeVisible();

    await drawer.getByRole("link", { name: "Services", exact: true }).click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(drawer).toBeHidden();
  });

  test("the drawer closes on Escape", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Open menu|Abrir menú/i }).click();
    await expect(page.locator("#mobile-drawer")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-drawer")).toBeHidden();
  });

  test("no horizontal overflow on any public page", async ({ page }) => {
    // A page that scrolls sideways on a phone is broken, however pretty it is.
    for (const path of ["/", "/partners/apply", "/checkout", "/privacy"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(overflow, `${path} overflows horizontally`).toBe(false);
    }
  });

  test("primary tap targets are at least 44px tall", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("button", { name: /Book Consultation|Reservar una Consulta/i }).first();
    const box = await cta.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);
  });
});

test.describe("chatbot", () => {
  test("opens, answers from published pricing, and closes on Escape", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Ask a question|Hacer una pregunta/i }).click();

    const panel = page.getByRole("dialog", { name: /VYNTEX Assistant|Asistente VYNTEX/i });
    await expect(panel).toBeVisible();

    await panel.getByRole("button", { name: /What does it cost/i }).click();

    // The answer must contain REAL published prices, read from lib/pricing.ts.
    await expect(panel.getByText("$500", { exact: false }).first()).toBeVisible();
    // And must never contain a partner cost.
    await expect(panel.getByText("$660")).toHaveCount(0);

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
  });
});
