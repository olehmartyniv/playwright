import { test, expect } from '@playwright/test';

test('Browser Context test', async function ({ browser }) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  console.log(await page.title());
});

test('Page Playwright test', async function ({ page }) {
  await page.goto('https://google.com/');
  console.log(await page.title());
  await expect(page).toHaveTitle('Google');
});
