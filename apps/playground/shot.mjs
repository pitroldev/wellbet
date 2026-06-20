import { chromium } from "playwright";

const base = process.env.BASE || "http://localhost:5690";
const slugs = process.argv.slice(2);
const browser = await chromium.launch();

for (const slug of slugs) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await ctx.newPage();
  await page.goto(`${base}/systems/${slug}`, {
    waitUntil: "load",
    timeout: 30000,
  });
  await page.waitForTimeout(800);
  // scroll through to trigger whileInView reveals, then back to top
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `shot-${slug}.png`, fullPage: true });
  await ctx.close();
  console.log("shot-" + slug + ".png");
}
await browser.close();
