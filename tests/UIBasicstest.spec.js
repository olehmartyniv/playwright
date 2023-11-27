import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

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

test('UI Controls', async function ({ page }) {
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

  const dropdown = page.locator('select.form-control');
  const radio = page.locator("[type='radio']").last();
  const checkbox = page.locator('#terms');
  const blinkingLink = page.locator('body > a');

  await radio.click();
  await page.locator('#okayBtn').click();
  await dropdown.selectOption('consult');
  await checkbox.check();
  await expect(checkbox).toBeChecked();
  await checkbox.uncheck();
  // assertions
  expect(await checkbox.isChecked()).toBeFalsy();
  await expect(radio).toBeChecked();
  await expect(blinkingLink).toHaveAttribute('class', 'blinkingText');
  await expect(blinkingLink).toHaveClass('blinkingText');
  // await page.pause();
});

test('Child windows handling', async function ({ browser }) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  const userName = page.locator('#username');
  const blinkingLink = page.locator("a[href*='documents-request']");

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    blinkingLink.click(),
  ]);

  const text = await newPage.locator('div > p.im-para.red').textContent();
  const domain = text.match(/@\S+/)[0].slice(1);
  await userName.fill(domain);
  // await page.pause();
});
