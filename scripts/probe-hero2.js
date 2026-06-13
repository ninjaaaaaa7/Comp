// Deeper probe: inline vs computed opacity, time-series, phone layer comparison.
const { chromium } = require('playwright-core');

const W = Number(process.argv[2] || 769);

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const ctx = await browser.newContext({ viewport: { width: W, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3003/', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2500);

  await page.evaluate(() => window.scrollTo(0, 1440));
  for (let s = 0; s < 4; s++) {
    await page.waitForTimeout(900);
    const r = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const col = hero.querySelector('.grid > div.relative');
      const t0 = col.children[0];
      // phone frame screens: find the rounded frame, its first 3 motion children
      const frame = hero.querySelector('div[class*="rounded-"][style*="border"]');
      const screens = frame ? Array.from(frame.children).slice(0, 3) : [];
      return {
        scrollY: window.scrollY,
        text0_inline: t0.style.opacity,
        text0_computed: getComputedStyle(t0).opacity,
        screens_inline: screens.map((s) => s.style.opacity),
      };
    });
    console.log(`sample${s}`, JSON.stringify(r));
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
