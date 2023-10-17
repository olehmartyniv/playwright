import { test, expect } from '@playwright/test';

test('Browser Context test', async function ({ browser }) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const userName = page.locator('#username');
  const signIn = page.locator('#signInBtn');
  const cardTitles = page.locator('.card-body a');

  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  console.log(await page.title());
  await userName.fill('rahulshetty');
  await page.locator("[type='password']").fill('learning');
  await signIn.click();
  console.log(await page.locator("[style*='none']").textContent());
  await expect(page.locator("[style*='none']")).toContainText('Incorrect');

  await userName.fill('');
  await userName.fill('rahulshettyacademy');
  await signIn.click();
  console.log(await cardTitles.first().textContent());
  console.log(await cardTitles.nth(1).textContent());

  const allTitles = await cardTitles.allTextContents();
  console.log(allTitles);
});

test('Page Playwright test', async function ({ page }) {
  await page.goto('https://google.com/');
  await expect(page).toHaveTitle('Google');
  console.log(await page.title());
});
