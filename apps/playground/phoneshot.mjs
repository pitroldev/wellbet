import { chromium } from "playwright";

const base = process.env.BASE || "http://localhost:5690";
const slugs = process.argv.slice(2);
const browser = await chromium.launch();

for (const slug of slugs) {
  const ctx = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(`${base}/systems/${slug}`, {
    waitUntil: "load",
    timeout: 30000,
  });
  await page.waitForTimeout(1200);
  const el = page.locator('[class*="aspect-[1206"]').first();
  try {
    await el.scrollIntoViewIfNeeded({ timeout: 5000 });
    await page.waitForTimeout(500);
    await el.screenshot({ path: `phone-${slug}.png` });
    console.log("phone-" + slug + ".png ok");
  } catch (e) {
    console.log("phone-" + slug + " FALHOU: " + e.message);
  }
  await ctx.close();
}
await browser.close();
