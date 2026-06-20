import { chromium } from "playwright";

const base = process.env.BASE || "http://localhost:5678";
const routes = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "/",
      "/systems/neo-arcade",
      "/systems/synthwave",
      "/systems/neon-sign",
      "/systems/alta-tensao",
      "/systems/holografico",
      "/systems/iso-gacha",
      "/systems/glow-comportamental",
    ];

const browser = await chromium.launch();
let totalErrors = 0;

for (const route of routes) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push("console.error: " + msg.text());
  });
  page.on("pageerror", (err) => errors.push("pageerror: " + (err.message || String(err))));

  let status = 0;
  try {
    const resp = await page.goto(base + route, {
      waitUntil: "load",
      timeout: 30000,
    });
    status = resp ? resp.status() : 0;
    await page.waitForTimeout(1000);
    // scroll through the whole page to trigger whileInView animations
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 500) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(110);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    // click EVERY clickable (buttons, role=button, cursor-pointer divs) — not nav links —
    // to trigger handler/animation errors (e.g. spring+multi-keyframe on open).
    const clickables = await page.$$(
      'button:not([disabled]), [role="button"], [class*="cursor-pointer"]',
    );
    for (const el of clickables) {
      try {
        await el.click({ timeout: 500, force: true });
        await page.waitForTimeout(110);
      } catch {}
    }
    await page.waitForTimeout(800);
  } catch (e) {
    errors.push("goto/interact failed: " + e.message);
  }
  await ctx.close();

  totalErrors += errors.length;
  console.log(`\n=== ${route} (HTTP ${status}) ===`);
  if (errors.length === 0) console.log("  OK — sem erros de console/runtime");
  else errors.slice(0, 12).forEach((e) => console.log("  X " + e));
}

await browser.close();
console.log(`\n--- TOTAL: ${totalErrors} erro(s) ---`);
process.exit(totalErrors > 0 ? 1 : 0);
