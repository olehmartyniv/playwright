import { test, expect } from '@playwright/test';
import { customTest } from '../utils/testBase.js';
import POManager from '../pageobjects/POManager.js';
import testData from '../utils/placeorderTestData.json' assert { type: 'json' };

for (const data of testData) {
  test(`First practice for ${data.productName}`, async function ({ page }) {
    // login
    const poManager = new POManager(page);
    await poManager.loginPage.goTo();
    await poManager.loginPage.validLogin(data.username, data.password);
    // get first title
    expect(
      await poManager.dashboardPage.searchProduct(data.productName)
    ).toBeTruthy();
  });
}

customTest('E2E scenario', async function ({ page, placeOrderData }) {
  const extractNumber = priceValue => +priceValue.match(/\d+/);

  const poManager = new POManager(page);

  // login
  await poManager.loginPage.goTo();
  await poManager.loginPage.validLogin(
    placeOrderData.username,
    placeOrderData.password
  );

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

  await expect(poManager.orderPage.shippingUsernam).toHaveText(
    placeOrderData.username
  );
  await poManager.orderPage.shippingCountry.pressSequentially(
    placeOrderData.country.toLocaleLowerCase().slice(0, 3),
    {
      delay: 100,
    }
  );

  await poManager.orderPage.dropdownCountries.waitFor();
  await poManager.orderPage.selectCountry(placeOrderData.country).click();
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
