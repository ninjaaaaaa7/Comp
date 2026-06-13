// Screenshot the nav/back fixes on the previously bare pages.
const { chromium } = require('playwright-core');
const OUT = 'E:/companio/_tmp_imgcheck/nav';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 850 } });
  const page = await ctx.newPage();
  const shot = (n) => page.screenshot({ path: `${OUT}/${n}.png` });

  for (const [route, name] of [
    ['/dashboard', 'dashboard'],
    ['/pricing', 'pricing'],
    ['/companion/ananya', 'profile'],
    ['/book?companion=ananya', 'book'],
    ['/quiz', 'quiz'],
  ]) {
    await page.goto('http://localhost:3003' + route, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(1800);
    await shot(name);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
