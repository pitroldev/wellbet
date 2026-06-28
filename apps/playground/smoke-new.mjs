// Aggressive smoke test for the wellbet & Co. systems.
// Loads each route (mobile viewport), scrolls through, clicks every interactive
// element twice, and reports console/page errors. Usage: node smoke-new.mjs [slug ...]
import { chromium } from "playwright";

const PORT = process.env.PORT || 5690;
const base = `http://localhost:${PORT}`;
const slugs =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : ["editorial-muma", "wellbet-clean", "gymbet-arena", "voltage", "ecossistema"];

const browser = await chromium.launch();
let totalErr = 0;

for (const slug of slugs) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + String(e)));

  const url = `${base}/systems/${slug}`;
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(700);

    // scroll through to mount whileInView content
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 500) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(80);
    }

    // click every interactive element twice (idempotent demo of state)
    const sel = 'button:not([disabled]), [role="button"], a[href^="#"], input[type="range"]';
    const handles = await page.$$(sel);
    let clicks = 0;
    for (const el of handles) {
      try {
        await el.scrollIntoViewIfNeeded({ timeout: 800 });
        await el.click({ timeout: 800, force: true });
        clicks++;
        await page.waitForTimeout(40);
      } catch {
        /* ignore non-clickable */
      }
    }
    // second pass on a subset (toggles, slots)
    for (const el of handles.slice(0, 30)) {
      try {
        await el.click({ timeout: 600, force: true });
        await page.waitForTimeout(30);
      } catch {}
    }
    await page.waitForTimeout(400);

    const tag = errors.length ? `❌ ${errors.length} ERROS` : "✅ 0 erros";
    console.log(`[${slug}] ${tag} · altura ${h}px · ${clicks} cliques`);
    if (errors.length) errors.slice(0, 10).forEach((e) => console.log("    · " + e.slice(0, 200)));
    totalErr += errors.length;
  } catch (e) {
    console.log(`[${slug}] ❌ FALHA AO CARREGAR: ${String(e).slice(0, 160)}`);
    totalErr += 1;
  }
  await ctx.close();
}

await browser.close();
console.log(totalErr === 0 ? "\n=== TUDO LIMPO ===" : `\n=== ${totalErr} erro(s) no total ===`);
process.exit(totalErr === 0 ? 0 : 1);
