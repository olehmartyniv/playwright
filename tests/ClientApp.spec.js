import { test, expect } from '@playwright/test';

test.skip('First practce', async function ({ page }) {
  // open register page
  await page.goto('https://rahulshettyacademy.com/client/');
  await page.locator('.text-reset').click();
  // register
  const counter = 5;

  await page.locator('#firstName').fill(`testF${counter}`);
  await page.locator('#lastName').fill(`testL${counter}`);
  await page.locator('#userEmail').fill(`test00${counter}@mail.com`);
  await page.locator('#userMobile').fill(`100000000${counter}`);
  await page.locator('#userPassword').fill(`P@ss000${counter}`);
  await page.locator('#confirmPassword').fill(`P@ss000${counter}`);
  await page.locator("[type='checkbox']").check();
  await page.locator('#login').click();
  // go to login
  await expect(page.locator('h1.headcolor')).toBeAttached();
  await expect(page.locator('h1.headcolor')).toHaveText(
    'Account Created Successfully'
  );
  await page.locator("[routerlink='/auth']").click();
  // login
  await page.locator('#userEmail').fill(`test00${counter}@mail.com`);
  await page.locator('#userPassword').fill(`P@ss000${counter}`);
  await page.locator('#login').click();
  // get first title
  // await page.waitForLoadState('networkidle');
  await page.locator('h5 > b').first().waitFor();
  console.log(await page.locator('h5 > b').allTextContents());
  await expect(page.locator('h5 > b').first()).toHaveText('zara coat 3');
});
