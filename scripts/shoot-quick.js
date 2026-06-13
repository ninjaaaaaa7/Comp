// Quick top + hero-state-1 shots at a given width (headed, wheel-driven).
const { chromium } = require('playwright-core');

const W = Number(process.argv[2] || 773);
const OUT = 'E:/companio/_tmp_imgcheck/ss';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: false,
  });
  const ctx = await browser.newContext({ viewport: { width: W, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3003/', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${OUT}/quick-${W}-top.png` });
  await page.mouse.move(W / 2, 450);
  // wheel to mid-hero (state 1)
  for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, 260); await page.waitForTimeout(250); }
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/quick-${W}-state1.png` });
  console.log('done', await page.evaluate(() => window.scrollY));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
