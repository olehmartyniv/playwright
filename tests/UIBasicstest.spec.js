import { test, expect } from '@playwright/test';

test('Browser Context test', async function ({ browser }) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  console.log(await page.title());
  await page.locator('#username').fill('rahulshetty');
  await page.locator('#password').fill('learning');
  await page.locator('#signInBtn').click();
});

test('Page Playwright test', async function ({ page }) {
  await page.goto('https://google.com/');
  await expect(page).toHaveTitle('Google');
  console.log(await page.title());
});
