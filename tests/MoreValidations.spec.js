import { test, expect } from '@playwright/test';

test('Popup validations', async function ({ page }) {
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
  // await page.goto('https://google.com/');
  // await page.goBack();
  // await page.goForward();

  await expect(page.locator('#displayed-text')).toBeVisible();
  await page.locator('#hide-textbox').click();
  await expect(page.locator('#displayed-text')).toBeHidden();

  page.on('dialog', dialog => dialog.accept());
  await page.locator('#confirmbtn').click();
  await page.locator('#mousehover').hover();

  const framesPage = page.frameLocator('#courses-iframe');
  await framesPage.locator("li a[href*='lifetime-access']:visible").click();
  const textCheck = (
    await framesPage
      .getByRole('heading', {
        name: 'Happy Subscibers!',
      })
      .textContent()
  ).match(/[\d,]+/)[0];
  console.log(textCheck);
});

test('Screenshot & Visual comparision', async function ({ page }) {
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
  await expect(page.locator('#displayed-text')).toBeVisible();
  // await page.locator('#displayed-text').screenshot({ path: 'partialScreenshot.png' });
  await page.locator('#hide-textbox').click();
  await page.screenshot({ path: 'screenshot.png' });

  await expect(page.locator('#displayed-text')).toBeHidden();
});

test('visual', async function ({ page }) {
  await page.goto('https://google.com/');
  expect(await page.screenshot()).toMatchSnapshot('landing.png');
});
