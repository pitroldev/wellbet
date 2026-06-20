import { chromium } from "playwright";

const base = process.env.BASE || "http://localhost:5690";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 880 } });
const p = await ctx.newPage();
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + (e.message || String(e))));
p.on("console", (m) => {
  if (m.type() === "error") errs.push("console.error: " + m.text());
});

await p.goto(base + "/systems/iso-gacha", {
  waitUntil: "load",
  timeout: 30000,
});
await p.waitForTimeout(700);
const h = await p.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 480) {
  await p.evaluate((yy) => window.scrollTo(0, yy), y);
  await p.waitForTimeout(85);
}
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(400);
await p.screenshot({ path: "iso-full.png", fullPage: true });

// slot: clicar Girar e capturar spin + win
const girar = p.getByRole("button", { name: /Girar/i }).first();
await girar.scrollIntoViewIfNeeded();
await p.evaluate(() => window.scrollBy(0, -160));
await p.waitForTimeout(300);
await p.screenshot({ path: "iso-slot-idle.png" });
await girar.click();
await p.waitForTimeout(550);
await p.screenshot({ path: "iso-slot-spin.png" });
await p.waitForTimeout(1700);
await p.screenshot({ path: "iso-slot-win.png" });

const txt = await p
  .getByText(/Aposta grátis|BOOST|Shield|Boost de cotação/i)
  .allInnerTexts()
  .catch(() => []);
console.log("prêmio visível:", JSON.stringify(txt.slice(0, 6)));
console.log("erros de runtime:", errs.length);
errs.slice(0, 6).forEach((e) => console.log("  X " + e));
await b.close();
