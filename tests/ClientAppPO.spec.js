import { test, expect } from '@playwright/test';
import LoginPage from '../pageobjects/LoginPage.js';
import DashboardPage from '../pageobjects/DashboardPage.js';
import CartPage from '../pageobjects/CartPage.js';
import OrderPage from '../pageobjects/OrderPage.js';

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
  const product = await dashboardPage.getRandomProduct();

  const productName = await dashboardPage.getProductName(product);
  const productPrice = extractNumber(
    await dashboardPage.getProductPrice(product)
  );

  await expect(dashboardPage.getCartItemsNumbers()).toHaveText('');
  await dashboardPage.addProductToCart(product);
  await expect(dashboardPage.getCartItemsNumbers()).toHaveText('1');
  await dashboardPage.goToCart();

  // cart
  await expect(page).toHaveURL(/cart$/);
  await expect(page.getByRole('heading', { name: 'My Cart' })).toBeVisible();
  await expect(page.getByRole('heading', { name: productName })).toBeVisible();

  const cartPage = new CartPage(page);
  const cartItem = cartPage.getItem(productName);

  expect(await cartPage.getItemName(cartItem)).toBe(productName);
  expect(extractNumber(await cartPage.getItemPrice(cartItem))).toBe(
    productPrice
  );
  await cartPage.goToCheckout();

  // checkout
  await expect(page).toHaveURL(/order/);
  await expect(page.getByText('Payment Method')).toBeVisible();

  const orderPage = new OrderPage(page);

  expect((await orderPage.getItemName()).trim()).toBe(productName);
  expect(extractNumber(await orderPage.getItemPrice())).toBe(productPrice);
  expect((await orderPage.getItemQuantity()).trim()).toBe('Quantity: 1');
  expect(await orderPage.getItemDescription()).toBe(productName);

  await expect(orderPage.paymentMethod).toHaveClass(/active/);
  await expect(orderPage.creditCardNumber).toHaveValue('4542 9931 9292 2293');
  await orderPage.creditCardCVVCode.fill('666');
  await orderPage.couponInput.fill('rahulshettyacademy');
  await orderPage.couponApplyButton.click();
  await expect(orderPage.couponConfirmedLabel).toBeVisible();

  await expect(orderPage.shippingUsernam).toHaveText(username);
  await orderPage.shippingCountry.pressSequentially('ukr', { delay: 100 });

  await orderPage.dropdownCountries.waitFor();
  await orderPage.selectCountry(country).click();
  await orderPage.placeOrderButton.click();

  // verify completion
  await expect(page).toHaveURL(/thanks/);
  await expect(
    page.getByRole('heading', { name: 'Thankyou for the order.' })
  ).toBeVisible();

  /*const orderNumber = (
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
