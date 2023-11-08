import { test, expect, request } from '@playwright/test';
import APIUtils2 from '../utils/APIUtils2.js';

const setLocalStorage = value => window.localStorage.setItem('token', value);

const loginPayload = {
  userEmail: 'test000@mail.com',
  userPassword: 'P@ss0000',
};
const body = JSON.stringify({ data: [], message: 'No Orders' });
let apiUtils;
let authToken;

test.beforeAll(async function () {
  const requestContext = await request.newContext();
  apiUtils = new APIUtils2(requestContext, loginPayload);
  authToken = await apiUtils.getToken();
});

test('Intercept response', async function ({ page }) {
  page.addInitScript(setLocalStorage, authToken);

  await page.goto('https://rahulshettyacademy.com/client/');
  await page.route(/get-orders-for-customer/, async route => {
    await route.fetch();
    await route.fulfill({ body });
  });
  await page.getByRole('button', { name: ' ORDERS' }).click();
  await page.waitForResponse(/get-orders-for-customer/);
  await expect(page).toHaveURL(/myorders$/);
  await expect(
    page.getByText(
      'You have No Orders to show at this time. Please Visit Back Us'
    )
  ).toBeVisible();
});

test('Intercept request', async function ({ page }) {
  page.addInitScript(setLocalStorage, authToken);

  await page.goto('https://rahulshettyacademy.com/client/');
  await page.route(/get-orders-details/, async (route, request) => {
    const url = request.url().replace(/[^=]*$/, '621661f884b053f6765465b6');
    await route.continue({ url });
  });
  await page.getByRole('button', { name: ' ORDERS' }).click();
  await page.waitForResponse(/get-orders-for-customer/);
  await expect(page).toHaveURL(/myorders$/);
  await page.getByRole('button', { name: 'View' }).first().click();
  await expect(page).toHaveURL(/order-details/);
  await expect(
    page.getByText('You are not authorize to view this order')
  ).toBeVisible();
});

test('Abort request', async function ({ page }) {
  page.addInitScript(setLocalStorage, authToken);

  page.on('response', response =>
    console.log(response.url(), response.status())
  );
  await page.route('**/*.{jpg,png,jpeg}', async route => await route.abort());
  await page.goto('https://rahulshettyacademy.com/client/');
  await page.getByRole('button', { name: ' ORDERS' }).click();
  await page.waitForResponse(/get-orders-for-customer/);
  await expect(page).toHaveURL(/myorders$/);
});
