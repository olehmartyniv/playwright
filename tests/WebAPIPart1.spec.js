import { test, expect, request } from '@playwright/test';
import APIUtils from '../utils/APIUtils.js';

const setLocalStorage = value => window.localStorage.setItem('token', value);

const loginPayload = {
  userEmail: 'test000@mail.com',
  userPassword: 'P@ss0000',
};
const orderPayload = {
  orders: [
    {
      country: 'Ukraine',
      productOrderedId: '6262e990e26b7e1a10e89bfa',
    },
  ],
};
let response;

test.beforeAll(async function () {
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayload);

  response = await apiUtils.createOrder(orderPayload);
});

test('Set localStorage @api', async function ({ page }) {
  page.addInitScript(setLocalStorage, response.authToken);

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

test('Use headers @api', async function ({ page }) {
  page.addInitScript(setLocalStorage, response.authToken);

  await page.goto('https://rahulshettyacademy.com/client/');

  await page.getByRole('button', { name: ' ORDERS' }).click();
  await expect(page).toHaveURL(/myorders$/);
  await expect(page.getByText('Your Orders')).toBeVisible();
  await expect(
    await page.locator("th[scope='row']").allTextContents()
  ).toContain(response.orderId);
});
