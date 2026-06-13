// Dump cssText of hero text blocks + console errors at two scroll points.
const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: false,
  });
  const ctx = await browser.newContext({ viewport: { width: 769, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text().slice(0, 300)); });
  await page.goto('http://localhost:3003/', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.mouse.move(380, 450);

  for (const target of [700, 1500]) {
    // wheel until past target
    let y = await page.evaluate(() => window.scrollY);
    while (y < target) {
      await page.mouse.wheel(0, 250);
      await page.waitForTimeout(120);
      y = await page.evaluate(() => window.scrollY);
    }
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const col = hero.querySelector('.grid > div.relative');
      return {
        scrollY: Math.round(window.scrollY),
        nChildren: col.children.length,
        css: Array.from(col.children).map((c) => c.style.cssText.slice(0, 200)),
      };
    });
    console.log(JSON.stringify(r, null, 1));
  }
  console.log('CONSOLE:', JSON.stringify(errors.slice(0, 10)));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
