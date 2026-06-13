// Screenshot pages at given viewport widths using system Chrome.
// Usage: node scripts/shoot.js
const { chromium } = require('playwright-core');

const BASE = 'http://localhost:3003';
const OUT = 'E:/companio/_tmp_imgcheck/ss';
const WIDTHS = [769, 773];
const PAGES = [
  { path: '/', name: 'home' },
  { path: '/explore', name: 'explore' },
];

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    for (const p of PAGES) {
      await page.goto(BASE + p.path, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(3000);
      // Viewport (top) shot
      await page.screenshot({ path: `${OUT}/${p.name}-${w}-top.png` });
      // Full-page shot for layout/spacing inspection
      await page.screenshot({ path: `${OUT}/${p.name}-${w}-full.png`, fullPage: true });
      console.log(`${p.name} @ ${w}px done`);
    }
    await ctx.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
