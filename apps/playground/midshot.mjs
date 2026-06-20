import { chromium } from "playwright";

const base = process.env.BASE || "http://localhost:5690";
const slug = process.argv[2];
const fracs = process.argv.slice(3).map(Number); // e.g. 0.6 0.82
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto(`${base}/systems/${slug}`, {
  waitUntil: "load",
  timeout: 30000,
});
await page.waitForTimeout(700);
const h = await page.evaluate(() => document.body.scrollHeight);
// gentle full scroll to trigger reveals
for (let y = 0; y < h; y += 500) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(110);
}
let i = 0;
for (const f of fracs) {
  const y = Math.round(h * f);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `mid-${slug}-${i}.png` });
  console.log(`mid-${slug}-${i}.png @ y=${y}`);
  i++;
}
await browser.close();
