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

await p.goto(base + "/systems/neo-arcade", {
  waitUntil: "load",
  timeout: 30000,
});
await p.waitForTimeout(800);
const h = await p.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 480) {
  await p.evaluate((yy) => window.scrollTo(0, yy), y);
  await p.waitForTimeout(80);
}
const lever = p.getByText(/PUXAR ALAVANCA/i).first();
await lever.scrollIntoViewIfNeeded();
await p.evaluate(() => window.scrollBy(0, -120));
await p.waitForTimeout(400);
await p.screenshot({ path: "slot-0-idle.png" });

await lever.click();
await p.waitForTimeout(650);
await p.screenshot({ path: "slot-1-spin.png" });
await p.waitForTimeout(2600);
await p.screenshot({ path: "slot-2-win.png" });

const txt = await p
  .getByText(/Aposta grátis|BOOST|Shield|Boost de cotação|R\$/i)
  .allInnerTexts()
  .catch(() => []);
console.log("textos visíveis (prêmio):", JSON.stringify(txt));
console.log("erros de runtime:", errs.length);
errs.slice(0, 8).forEach((e) => console.log("  X " + e));
await b.close();
