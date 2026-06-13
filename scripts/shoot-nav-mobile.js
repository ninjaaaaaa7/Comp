// Mobile (390px) check of nav/back fixes — FlowTopBar + Nav must not break.
const { chromium } = require('playwright-core');
const OUT = 'E:/companio/_tmp_imgcheck/nav';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, isMobile: true });
  const page = await ctx.newPage();
  const shot = (n) => page.screenshot({ path: `${OUT}/m-${n}.png` });

  for (const [route, name] of [
    ['/dashboard', 'dashboard'],
    ['/book?companion=ananya', 'book'],
    ['/quiz', 'quiz'],
    ['/companion/ananya', 'profile'],
  ]) {
    await page.goto('http://localhost:3003' + route, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(1600);
    await shot(name);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
