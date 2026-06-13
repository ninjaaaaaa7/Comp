// Precise register-wizard drive.
const { chromium } = require('playwright-core');
const OUT = 'E:/companio/_tmp_imgcheck/e2e';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: false,
  });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
  const S = (n) => page.screenshot({ path: `${OUT}/${n}.png` });

  await page.goto('http://localhost:3003/register', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.getByText('I want to find a companion', { exact: true }).click();
  await page.waitForTimeout(1200);
  await S('21b-about');

  for (const i of await page.locator('main input, main select').all()) {
    const tag = await i.evaluate((el) => el.tagName.toLowerCase());
    if (tag === 'select') {
      await i.selectOption({ index: 1 }).catch(() => {});
      continue;
    }
    const t = await i.getAttribute('type');
    if (t === 'email') await i.fill('demo@companio.in');
    else if (t === 'password') await i.fill('Sunrise7Walks');
    else if (t === 'date') await i.fill('1999-04-12');
    else if ((t === 'text' || !t) && !(await i.inputValue())) await i.fill('Samarth');
  }
  await page.waitForTimeout(400);
  await S('22b-filled');
  await page.getByRole('button', { name: /continue|next/i }).first().click();
  await page.waitForTimeout(1400);
  await page.fill('input[type="tel"]', '9876543210').catch(() => {});
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: /send|otp|code|verify|continue/i }).first().click().catch(() => {});
  await page.waitForTimeout(1100);
  await S('23c-otp');
  await page.getByText(/autofill/i).first().click().catch(() => {});
  await page.waitForTimeout(900);
  for (const c of await page.locator('main input[type="checkbox"]').all()) {
    await c.check().catch(() => {});
  }
  await page.waitForTimeout(300);
  await S('23d-terms');
  await page.getByRole('button', { name: /create|finish|verify|continue|done/i }).first().click().catch(() => {});
  await page.waitForTimeout(2200);
  await S('24b-done');
  console.log('URL:', page.url(), 'ERRS:', JSON.stringify(errs));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
