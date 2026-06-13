// Check whether scroll-linked WAAPI animations (ScrollTimeline) exist on hero blocks.
const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: false,
  });
  const ctx = await browser.newContext({ viewport: { width: 769, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3003/', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(3000);
  const r = await page.evaluate(() => {
    const all = document.getAnimations();
    const hero = document.getElementById('hero');
    const col = hero.querySelector('.grid > div.relative');
    const blocks = Array.from(col.children);
    const onBlocks = all.filter((a) => blocks.includes(a.effect?.target));
    return {
      totalAnimations: all.length,
      scrollTimelineCount: all.filter((a) => a.timeline && a.timeline.constructor.name !== 'DocumentTimeline').length,
      heroBlockAnims: onBlocks.map((a) => ({
        timeline: a.timeline?.constructor?.name,
        props: a.effect?.getKeyframes?.().map((k) => Object.keys(k).filter((x) => !['offset', 'easing', 'composite', 'computedOffset'].includes(x))).flat(),
        state: a.playState,
      })),
    };
  });
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
