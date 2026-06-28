// Screenshot helper for the new wellbet & Co. systems.
// Usage: node shot-new.mjs <slug|"" for hub> [outdir]
import { chromium } from "playwright";

const slug = process.argv[2] ?? "";
const out = process.argv[3] ?? "C:/Users/petro/AppData/Local/Temp/claude/L--Dev-charya/712821a3-9fa9-4af4-bbe3-2f501ab65600/scratchpad/shots";
const base = `http://localhost:${process.env.PORT || 5690}`;
const url = slug ? `${base}/systems/${slug}` : base;
const name = slug || "hub";

const browser = await chromium.launch();

async function shoot(width, height, tag, fullPage) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    isMobile: width < 500,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(900);
  // scroll through to trigger whileInView reveals
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/${name}-${tag}.png`, fullPage });
  await ctx.close();
  if (errors.length) console.log(`[${name}-${tag}] ERRORS:`, errors.slice(0, 8).join(" | "));
  else console.log(`[${name}-${tag}] ok, height=${h}px, 0 console errors`);
}

await shoot(390, 844, "mobile", true);
await shoot(1280, 900, "desktop", false);
await browser.close();
