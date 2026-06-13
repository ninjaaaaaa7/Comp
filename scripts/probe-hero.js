// Probe hero text-state opacities at fixed scroll positions.
const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const ctx = await browser.newContext({ viewport: { width: 769, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3003/', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2500);

  for (const y of [0, 400, 720, 1100, 1440, 1800]) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(2200); // generous settle for Lenis + framer
    const probe = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const sticky = hero ? hero.firstElementChild : null;
      // Hero left column: first child div.relative holds the 3 state blocks
      const col = hero ? hero.querySelector('.grid > div.relative') : null;
      const blocks = col ? Array.from(col.children) : [];
      return {
        scrollY: window.scrollY,
        heroTop: hero ? hero.getBoundingClientRect().top + window.scrollY : null,
        heroHeight: hero ? hero.offsetHeight : null,
        blockOpacities: blocks.map((b) => getComputedStyle(b).opacity),
        blockTransforms: blocks.map((b) => getComputedStyle(b).transform),
      };
    });
    console.log(`target=${y}`, JSON.stringify(probe));
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
