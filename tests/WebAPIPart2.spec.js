import { test, expect, request } from '@playwright/test';
import APIUtils2 from '../utils/APIUtils2.js';

const loginPayload = {
  userEmail: 'test001@mail.com',
  userPassword: 'P@ss0001',
};
const orderPayload = {
  orders: [
    {
      country: 'Ukraine',
      productOrderedId: '6262e990e26b7e1a10e89bfa',
    },
  ],
};
const contextOptions = {
  baseURL: 'https://rahulshettyacademy.com/',
  storageState: {
    cookies: [],
    origins: [
      {
        origin: '',
        localStorage: [],
      },
    ],
  },
};

let apiUtils;

test.beforeAll(async function () {
  const requestContext = await request.newContext();
  apiUtils = new APIUtils2(requestContext, loginPayload);
  contextOptions.storageState.origins[0].localStorage.push({
    name: 'token',
    value: `${await apiUtils.getToken(loginPayload)}`,
  });
});

test('Set localStorage @api', async function ({ browser }) {
  const context = await browser.newContext(contextOptions);
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

test('Use headers @api', async function ({ browser }) {
  const orderId = await apiUtils.createOrder(orderPayload);

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  await page.goto('https://rahulshettyacademy.com/client/');

  await page.getByRole('button', { name: ' ORDERS' }).click();
  await expect(page).toHaveURL(/myorders$/);
  await expect(page.getByText('Your Orders')).toBeVisible();
  await expect(
    await page.locator("th[scope='row']").allTextContents()
  ).toContain(orderId);
});
