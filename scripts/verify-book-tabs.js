// Precise booking completion + dashboard tab-switch verification.
const { chromium } = require('playwright-core');
const OUT = 'E:/companio/_tmp_imgcheck/e2e';
const B = 'http://localhost:3003';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: false,
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  const shot = (n) => page.screenshot({ path: `${OUT}/${n}.png` });

  // Unlock first so /companion and /book work
  await ctx.addInitScript(() => {
    try { localStorage.setItem('companio_unlocked', '1'); } catch {}
  });

  // ── Booking, step by step with the real labels ─────────────────────────────
  await page.goto(B + '/book?companion=ananya', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(1500);

  // Step 1 Activity: pick first tile, Continue
  await page.locator('button:has-text("City Walk")').first().click().catch(() => {});
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(700);
  // Step 2 Date: pick first date chip
  await page.locator('main button').filter({ hasNotText: 'Back' }).filter({ hasNotText: 'Continue' }).first().click().catch(() => {});
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(700);
  // Step 3 Time: pick first time
  await page.locator('main button').filter({ hasNotText: 'Back' }).filter({ hasNotText: 'Continue' }).first().click().catch(() => {});
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(700);
  // Step 4 Place: pick first place, then "Review booking"
  await page.locator('button:has-text("Bandstand")').first().click().catch(() => {});
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Review booking")').click();
  await page.waitForTimeout(900);
  await shot('40-book-review');
  // Step 5 Review: Confirm meetup (button text, not aria-label)
  await page.locator('button:has-text("Confirm meetup")').click();
  await page.waitForTimeout(2200);
  await shot('41-book-confirmed');
  const confirmedText = await page.locator('body').innerText();
  const didConfirm = /you'?re meeting|confirmed|booked/i.test(confirmedText);

  // ── Dashboard tab switching ────────────────────────────────────────────────
  await page.goto(B + '/dashboard?tab=bookings', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await shot('42-dash-bookings');
  const bookingsText = await page.locator('body').innerText();
  const hasBooking = /ananya|city walk|upcoming/i.test(bookingsText);

  // Click Messages tab
  await page.getByRole('button', { name: 'Messages' }).click().catch(() => {});
  await page.waitForTimeout(1200);
  await shot('43-dash-messages');
  const onMessages = /conversation|message|chat|safety/i.test(await page.locator('body').innerText());

  // Click Notifications tab
  await page.getByRole('button', { name: 'Notifications' }).click().catch(() => {});
  await page.waitForTimeout(1000);
  await shot('44-dash-notifs');
  const onNotifs = /meetup confirmed|notification|mark all|quiet/i.test(await page.locator('body').innerText());

  console.log(JSON.stringify({ didConfirm, hasBooking, onMessages, onNotifs, errs }, null, 1));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
