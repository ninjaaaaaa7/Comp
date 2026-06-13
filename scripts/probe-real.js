// Headed browser + mouse-wheel scrolling through Lenis (user-realistic).
// Verifies: hero crossfade, ClipReveal headings, activity scene states.
const { chromium } = require('playwright-core');

const OUT = 'E:/companio/_tmp_imgcheck/ss';
const W = Number(process.argv[2] || 769);

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: false,
  });
  const ctx = await browser.newContext({ viewport: { width: W, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3003/', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.mouse.move(W / 2, 450);

  const total = await page.evaluate(() => document.body.scrollHeight);
  let shot = 0;
  let lastY = 0;
  const probes = [];
  // Wheel in 300px increments — Lenis smooths each. Screenshot every ~700px travelled.
  while (true) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(350);
    const y = await page.evaluate(() => window.scrollY);
    if (y >= total - 950) break;
    if (y - lastY >= 700 || shot === 0) {
      await page.waitForTimeout(900); // settle
      const info = await page.evaluate(() => {
        const hero = document.getElementById('hero');
        const col = hero ? hero.querySelector('.grid > div.relative') : null;
        const ops = col ? Array.from(col.children).map((b) => getComputedStyle(b).opacity) : [];
        return { y: Math.round(window.scrollY), heroOps: ops.map(Number) };
      });
      probes.push(info);
      await page.screenshot({ path: `${OUT}/real-${W}-${String(shot).padStart(2, '0')}-y${info.y}.png` });
      lastY = y;
      shot++;
    }
    if (shot > 40) break;
  }
  console.log(JSON.stringify(probes));
  console.log(`${shot} shots, height ${total}`);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
