import { test, expect } from '@playwright/test';

test.beforeAll(async function ({ browser }) {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://rahulshettyacademy.com/client/');
  await page.locator('#userEmail').fill('test003@mail.com');
  await page.locator('#userPassword').fill('P@ss0003');
  await page.locator('#login').click();
  await page.waitForLoadState('networkidle');

  await context.storageState({ path: 'state.json' });
});

test('Use context', async function ({ browser }) {
  const context = await browser.newContext({ storageState: 'state.json' });
  const page = await context.newPage();

  await page.goto('https://rahulshettyacademy.com/client/');

  await expect(page).toHaveURL(/dash$/);
  await expect(
    page.locator('#sidebar').getByText('Home | Search')
  ).toBeVisible();
  const products = page.locator('div.card-body');
  const cartButton = page.getByRole('button', { name: ' Cart' });
  const product = products.nth(
    Math.floor(Math.random() * (await products.count()))
  );
  await expect(cartButton.locator('label')).toHaveText('');
  await product.getByRole('button', { name: ' Add To Cart' }).click();
  await expect(cartButton.locator('label')).toHaveText('1');
});
