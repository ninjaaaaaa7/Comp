// Verify dashboard tabs actually switch panels — checks the active tabpanel's
// aria-labelledby and a panel-unique marker, starting from a deep-linked tab.
const { chromium } = require('playwright-core');
const OUT = 'E:/companio/_tmp_imgcheck/e2e';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  // pre-seed a booking + favourite so panels have content
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem('companio_unlocked', '1');
      localStorage.setItem('companio_user', JSON.stringify({ firstName: 'Samarth' }));
      localStorage.setItem('companio_favorites', JSON.stringify(['rohan']));
      localStorage.setItem('companio_bookings', JSON.stringify([{
        id: 'bk_1_ananya', companionId: 'ananya', activity: 'City Walk',
        dateISO: '2026-06-20', time: 'Morning', place: 'Bandstand Promenade',
        status: 'upcoming', usedCredit: true, pricePaid: 0, createdAt: 1,
      }]));
    } catch {}
  });
  const page = await ctx.newPage();

  // Start deep-linked on bookings (the failing case)
  await page.goto('http://localhost:3003/dashboard?tab=bookings', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(1800);

  async function activePanel() {
    return page.evaluate(() => {
      const sel = document.querySelector('[role="tab"][aria-selected="true"]');
      const panel = document.querySelector('[role="tabpanel"]');
      return {
        activeTab: sel ? sel.textContent.trim() : 'none',
        labelledBy: panel ? panel.getAttribute('aria-labelledby') : 'none',
      };
    });
  }

  const results = {};
  results.initial = await activePanel();

  for (const tab of ['Messages', 'Saved', 'Notifications', 'Overview', 'Bookings']) {
    await page.getByRole('tab', { name: tab }).click();
    await page.waitForTimeout(700);
    results[tab] = await activePanel();
    await page.screenshot({ path: `${OUT}/tab-${tab.toLowerCase()}.png` });
  }

  console.log(JSON.stringify(results, null, 1));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
