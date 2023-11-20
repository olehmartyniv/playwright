import { test, expect } from '@playwright/test';
import POManager from '../pageobjects/POManager.js';

test('First practice', async function ({ page }) {
  const username = 'test003@mail.com';
  const password = 'P@ss0003';
  const productName = 'zara coat 3';
  // login
  const poManager = new POManager(page);
  await poManager.loginPage.goTo();
  await poManager.loginPage.validLogin(username, password);
  // get first title
  expect(poManager.dashboardPage.searchProduct(productName)).toBeTruthy();
});

test('E2E scenario', async function ({ page }) {
  const extractNumber = priceValue => +priceValue.match(/\d+/);

  const poManager = new POManager(page);
  const username = 'test002@mail.com';
  const password = 'P@ss0002';
  const country = 'Ukraine';

  // login
  await poManager.loginPage.goTo();
  await poManager.loginPage.validLogin(username, password);

  // add to cart
  await expect(page).toHaveURL(/dash$/);
  await expect(
    page.locator('#sidebar').getByText('Home | Search')
  ).toBeVisible();
  const product = await poManager.dashboardPage.getRandomProduct();

  const productName = await poManager.dashboardPage.getProductName(product);
  const productPrice = extractNumber(
    await poManager.dashboardPage.getProductPrice(product)
  );

  await expect(poManager.dashboardPage.getCartItemsNumbers()).toHaveText('');
  await poManager.dashboardPage.addProductToCart(product);
  await expect(poManager.dashboardPage.getCartItemsNumbers()).toHaveText('1');
  await poManager.dashboardPage.goToCart();

  // cart
  await expect(page).toHaveURL(/cart$/);
  await expect(page.getByRole('heading', { name: 'My Cart' })).toBeVisible();
  await expect(page.getByRole('heading', { name: productName })).toBeVisible();

  const cartItem = poManager.cartPage.getItem(productName);

  expect(await poManager.cartPage.getItemName(cartItem)).toBe(productName);
  expect(extractNumber(await poManager.cartPage.getItemPrice(cartItem))).toBe(
    productPrice
  );
  await poManager.cartPage.goToCheckout();

  // checkout
  await expect(page).toHaveURL(/order/);
  await expect(page.getByText('Payment Method')).toBeVisible();

  expect((await poManager.orderPage.getItemName()).trim()).toBe(productName);
  expect(extractNumber(await poManager.orderPage.getItemPrice())).toBe(
    productPrice
  );
  expect((await poManager.orderPage.getItemQuantity()).trim()).toBe(
    'Quantity: 1'
  );
  expect(await poManager.orderPage.getItemDescription()).toBe(productName);

  await expect(poManager.orderPage.paymentMethod).toHaveClass(/active/);
  await expect(poManager.orderPage.creditCardNumber).toHaveValue(
    '4542 9931 9292 2293'
  );
  await poManager.orderPage.creditCardCVVCode.fill('666');
  await poManager.orderPage.couponInput.fill('rahulshettyacademy');
  await poManager.orderPage.couponApplyButton.click();
  await expect(poManager.orderPage.couponConfirmedLabel).toBeVisible();

  await expect(poManager.orderPage.shippingUsernam).toHaveText(username);
  await poManager.orderPage.shippingCountry.pressSequentially('ukr', {
    delay: 100,
  });

  await poManager.orderPage.dropdownCountries.waitFor();
  await poManager.orderPage.selectCountry(country).click();
  await poManager.orderPage.placeOrderButton.click();

  // verify completion
  await expect(page).toHaveURL(/thanks/);
  await expect(
    page.getByRole('heading', { name: 'Thankyou for the order.' })
  ).toBeVisible();

  const orderNumber = (await poManager.confirmationPage.orderNumber).match(
    /\w+/
  );
  await poManager.confirmationPage.goToOrdersHistoryButton.click();

  // find order
  await expect(page).toHaveURL(/myorders$/);
  await expect(page.getByText('Your Orders')).toBeVisible();

  await expect(poManager.ordersHistoryPage.ordersIdsColumn).toContainText(
    orderNumber
  );
  await poManager.ordersHistoryPage
    .getGoToOrderDetailsButton(orderNumber)
    .click();

  // verify order
  await expect(page).toHaveURL(/order-details/);
  await expect(page.getByText('order summary')).toBeVisible();

  await expect(poManager.orderSummaryPage.orderId).toHaveText(orderNumber);
});
