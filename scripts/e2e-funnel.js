// End-to-end funnel drive (headed): quiz → explore → unlock → develop →
// profile → book → confirm → dashboard. Screenshots each beat + console errors.
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
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e).slice(0, 200)));

  const shot = (n) => page.screenshot({ path: `${OUT}/${n}.png` });

  // ── 1. Quiz ────────────────────────────────────────────────────────────────
  await page.goto(B + '/quiz', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2500);
  await shot('01-quiz-q1');

  // Q1 city: click Mumbai (default may already be selected) then Next/advance
  const clickFirst = async (sel) => {
    const el = page.locator(sel).first();
    if (await el.count()) { await el.click(); return true; }
    return false;
  };
  const advance = async () => {
    // explicit Next button if present, else echo auto-advances
    const next = page.getByRole('button', { name: /next|continue/i }).first();
    if (await next.count() && await next.isVisible().catch(() => false)) await next.click().catch(() => {});
  };

  // Answer 6 choice questions generically: pick first visible option tile(s), advance.
  for (let q = 0; q < 6; q++) {
    await page.waitForTimeout(900);
    // choice tiles are buttons inside the fieldset
    const tiles = page.locator('fieldset button');
    const n = await tiles.count();
    if (n > 0) await tiles.nth(Math.min(1, n - 1)).click().catch(() => {});
    await page.waitForTimeout(600);
    await advance();
    await page.waitForTimeout(2600); // echo + auto-advance
    await advance();
  }
  await shot('02-quiz-name');
  // Name input
  const nameInput = page.locator('input[type="text"]').first();
  if (await nameInput.count()) {
    await nameInput.fill('Samarth');
    await page.keyboard.press('Enter');
  }
  await page.waitForTimeout(1200);
  await shot('03-quiz-labor');
  await page.waitForTimeout(4500); // labor illusion ≈3.5s
  await shot('04-quiz-result');

  // Meet your companions → aurora wipe → explore
  const meetBtn = page.getByRole('button', { name: /meet your/i }).first();
  if (await meetBtn.count()) await meetBtn.click();
  await page.waitForTimeout(2200);
  await shot('05-explore-matched');
  if (!page.url().includes('/explore')) {
    await page.goto(B + '/explore?matched=1', { waitUntil: 'load' });
    await page.waitForTimeout(1500);
  }

  // ── 2. Unlock funnel ──────────────────────────────────────────────────────
  await page.locator('button:has-text("Tap to unlock")').first().click().catch(() => {});
  await page.waitForTimeout(900);
  await shot('06-unlock-sheet');
  await page.getByRole('button', { name: /UPI|GPay|Google Pay|PhonePe|Paytm/i }).first().click().catch(() => {});
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /Pay ₹199/i }).first().click();
  await page.waitForTimeout(1600);
  await shot('07-develop-reveal');
  await page.waitForTimeout(2500);
  await shot('08-explore-unlocked');

  // ── 3. Profile → booking ──────────────────────────────────────────────────
  await page.locator('a:has-text("View profile")').first().click();
  await page.waitForTimeout(2000);
  await shot('09-profile');
  await page.getByRole('link', { name: /book a meetup/i }).first().click().catch(async () => {
    await page.goto(B + '/book?companion=ananya', { waitUntil: 'load' });
  });
  await page.waitForTimeout(1800);
  await shot('10-book-step1');
  // 5 steps: pick first tile + Continue each time
  for (let s = 0; s < 4; s++) {
    await page.locator('fieldset button, [role="radiogroup"] button, main button[aria-pressed]').first().click().catch(() => {});
    await page.waitForTimeout(350);
    await page.getByRole('button', { name: /continue|next/i }).first().click().catch(() => {});
    await page.waitForTimeout(700);
  }
  await shot('11-book-review');
  await page.getByRole('button', { name: /confirm meetup/i }).first().click().catch(() => {});
  await page.waitForTimeout(2200);
  await shot('12-book-confirmed');

  // ── 4. Dashboard ──────────────────────────────────────────────────────────
  await page.goto(B + '/dashboard', { waitUntil: 'load' });
  await page.waitForTimeout(2200);
  await shot('13-dashboard');
  for (const tab of ['Bookings', 'Messages', 'Saved', 'Notifications']) {
    await page.getByRole('button', { name: tab }).first().click().catch(() => {});
    await page.waitForTimeout(900);
    await shot(`14-dash-${tab.toLowerCase()}`);
  }

  console.log('CONSOLE ERRORS:', JSON.stringify(errors.slice(0, 12)));
  console.log('FINAL URL:', page.url());
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
