// Secondary flows drive: register wizard, login, companion apply, companion
// dashboard, pricing checkout. Fresh context (no stored state).
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
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e).slice(0, 200)));
  const shot = (n) => page.screenshot({ path: `${OUT}/${n}.png` });

  // ── Register wizard ───────────────────────────────────────────────────────
  await page.goto(B + '/register', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2000);
  await shot('20-register-role');
  await page.getByText(/find a companion/i).first().click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /continue|next/i }).first().click().catch(() => {});
  await page.waitForTimeout(1000);
  await shot('21-register-about');
  // Fill about-you generically
  await page.fill('input[autocomplete="given-name"], input[name*="name" i]', 'Samarth').catch(() => {});
  await page.fill('input[type="email"]', 'demo@companio.in').catch(() => {});
  await page.fill('input[type="password"]', 'Sunrise7Walks').catch(() => {});
  await page.fill('input[type="date"]', '1999-04-12').catch(() => {});
  await page.waitForTimeout(300);
  await shot('22-register-filled');
  await page.getByRole('button', { name: /continue|next/i }).first().click().catch(() => {});
  await page.waitForTimeout(1000);
  // Verify step: phone + OTP
  await page.fill('input[type="tel"]', '9876543210').catch(() => {});
  await page.getByRole('button', { name: /send|continue|verify/i }).first().click().catch(() => {});
  await page.waitForTimeout(900);
  await shot('23-register-otp');
  await page.getByText(/autofill/i).first().click().catch(() => {});
  await page.waitForTimeout(600);
  // terms checkbox
  await page.locator('input[type="checkbox"]').first().check().catch(() => {});
  await page.getByRole('button', { name: /verify|continue|create|finish/i }).first().click().catch(() => {});
  await page.waitForTimeout(1500);
  await shot('24-register-done');

  // ── Login (fresh page, after sign out state persists anyway) ─────────────
  await page.goto(B + '/login', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await shot('25-login');

  // ── Companion apply ───────────────────────────────────────────────────────
  await page.goto(B + '/become-a-companion', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await shot('26-become');
  await page.goto(B + '/become-a-companion/apply', { waitUntil: 'load' });
  await page.waitForTimeout(1800);
  await shot('27-apply-step1');

  // ── Companion dashboard ───────────────────────────────────────────────────
  await page.goto(B + '/companion-dashboard', { waitUntil: 'load' });
  await page.waitForTimeout(2200);
  await shot('28-companion-dash');

  // ── Pricing checkout ──────────────────────────────────────────────────────
  await page.goto(B + '/pricing', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await shot('29-pricing-top');
  await page.getByRole('button', { name: /buy 5-pack/i }).first().click().catch(() => {});
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: /UPI|GPay|PhonePe|Paytm/i }).first().click().catch(() => {});
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /^pay/i }).first().click().catch(() => {});
  await page.waitForTimeout(1800);
  await shot('30-pricing-success');

  // ── Legal page ────────────────────────────────────────────────────────────
  await page.goto(B + '/trust', { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  await shot('31-trust');

  console.log('PAGE ERRORS:', JSON.stringify(errors.slice(0, 10)));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
