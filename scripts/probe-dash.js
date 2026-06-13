const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const ctx = await b.newContext({ viewport: { width: 390, height: 780 }, isMobile: true });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3003/dashboard', { waitUntil: 'load', timeout: 60000 });
  await p.waitForTimeout(3000);
  const r = await p.evaluate(() => {
    const h1 = document.querySelector('h1');
    const rect = h1.getBoundingClientRect();
    let el = h1, chain = [];
    while (el && el !== document.body) {
      const s = getComputedStyle(el);
      chain.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 36), opacity: s.opacity, transform: s.transform.slice(0, 24), visibility: s.visibility });
      el = el.parentElement;
    }
    return { rect: { top: Math.round(rect.top), h: Math.round(rect.height) }, chain: chain.slice(0, 7) };
  });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
