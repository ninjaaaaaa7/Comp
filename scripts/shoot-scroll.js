// Viewport screenshots at stepped scroll positions to inspect
// scroll-driven (sticky) sections. Usage: node scripts/shoot-scroll.js [width]
const { chromium } = require('playwright-core');

const BASE = 'http://localhost:3003';
const OUT = 'E:/companio/_tmp_imgcheck/ss';
const W = Number(process.argv[2] || 769);

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const ctx = await browser.newContext({ viewport: { width: W, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2500);

  const total = await page.evaluate(() => document.body.scrollHeight);
  const step = 720; // 80% of viewport height
  let i = 0;
  for (let y = 0; y < total; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(650); // let scroll-linked animation settle
    await page.screenshot({ path: `${OUT}/scroll-${W}-${String(i).padStart(2, '0')}-y${y}.png` });
    i++;
  }
  console.log(`${i} shots, total height ${total}`);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
