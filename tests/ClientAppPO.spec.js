import { test, expect } from '@playwright/test';
import LoginPage from '../pageobjects/LoginPage.js';
import DashboardPage from '../pageobjects/DashboardPage.js';

test('First practice', async function ({ page }) {
  const username = 'test004@mail.com';
  const password = 'P@ss0004';
  const productName = 'zara coat 3';
  // login
  const loginPage = new LoginPage(page);
  await loginPage.goTo();
  await loginPage.validLogin(username, password);
  // get first title
  const dashboardPage = new DashboardPage(page);
  expect(dashboardPage.searchProduct(productName)).toBeTruthy();
});

test('E2E scenario', async function ({ page }) {
  const extractNumber = priceValue => +priceValue.match(/\d+/);

  const username = 'test000@mail.com';
  const password = 'P@ss0000';
  const country = 'Ukraine';

  // login
  const loginPage = new LoginPage(page);
  await loginPage.goTo();
  await loginPage.validLogin(username, password);

  // add to cart
  const dashboardPage = new DashboardPage(page);
  await expect(page).toHaveURL(/dash$/);
  await expect(
    page.locator('#sidebar').getByText('Home | Search')
  ).toBeVisible();
  await dashboardPage.getRandomProduct();

  const productName = await dashboardPage.getProductName();
  const productPrice = extractNumber(await dashboardPage.getProductPrice());

  await expect(dashboardPage.getCartItemsNumbers()).toHaveText('');
  await dashboardPage.addProductToCart();
  await expect(dashboardPage.getCartItemsNumbers()).toHaveText('1');
  await dashboardPage.goToCart();

  // cart
  await expect(page).toHaveURL(/cart$/);
  await expect(page.getByRole('heading', { name: 'My Cart' })).toBeVisible();

  await expect(page.getByRole('heading', { name: productName })).toBeVisible();
  /*const cartItem = page
    .locator('div.cart > ul > li')
    .filter({ hasText: productName });

  await expect(cartItem.locator('h3')).toHaveText(productName);
  expect(
    extractNumber(await cartItem.locator('div.prodTotal > p').textContent())
  ).toBe(productPrice);
  await page.getByRole('button', { name: 'Checkout' }).click();

  // checkout
  await expect(page).toHaveURL(/order/);
  await expect(page.getByText('Payment Method')).toBeVisible();

  const itemDetails = page.locator('div.item__details');

  await expect(itemDetails.locator('div.item__title')).toHaveText(productName);
  await expect(
    extractNumber(await itemDetails.locator('div.item__price').textContent())
  ).toBe(productPrice);
  await expect(itemDetails.locator('div.item__quantity')).toHaveText(
    'Quantity: 1'
  );
  await expect(itemDetails.locator('div.item__description')).toHaveText(
    productName
  );

  await expect(page.getByText('Credit Card', { exact: true })).toHaveClass(
    /active/
  );
  await expect(page.locator(":text('Credit Card Number') + input")).toHaveValue(
    '4542 9931 9292 2293'
  );
  await page.locator(":text('CVV Code ?') + input").fill('666');
  await page
    .locator(":text('Apply Coupon') + input")
    .fill('rahulshettyacademy');
  await page.getByRole('button', { name: 'Apply Coupon' }).click();
  await expect(page.getByText('* Coupon Applied')).toBeVisible();

  await expect(page.locator('div.user__name > label')).toHaveText(username);
  await page
    .getByPlaceholder('Select Country')
    .pressSequentially('ukr', { delay: 100 });

  const dropdown = page.locator('section.ta-results');
  await dropdown.waitFor();
  await dropdown.locator('span').filter({ hasText: country }).click();
  await page.getByText('Place Order').click();

  // verify completion
  await expect(page).toHaveURL(/thanks/);
  await expect(
    page.getByRole('heading', { name: 'Thankyou for the order.' })
  ).toBeVisible();

  const orderNumber = (
    await page.locator('td > label').last().textContent()
  ).match(/\w+/);
  await page.getByText('Orders History Page').click();

  // find order
  await expect(page).toHaveURL(/myorders$/);
  await expect(page.getByText('Your Orders')).toBeVisible();

  await expect(page.locator("th[scope='row']")).toContainText(orderNumber);
  await page
    .getByRole('row')
    .filter({ hasText: orderNumber })
    .getByRole('button', { name: 'View' })
    .click();

  // verify order
  await expect(page).toHaveURL(/order-details/);
  await expect(page.getByText('order summary')).toBeVisible();

  await expect(page.locator('div.col-text')).toHaveText(orderNumber);*/
});
