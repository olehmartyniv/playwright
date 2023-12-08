import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

setDefaultTimeout(10 * 1000);

Given(
  'login to Ecommerce application with {string} and {string}',
  async function (username, password) {
    await this.poManager.loginPage.goTo();
    await this.poManager.loginPage.validLogin(username, password);
  }
);

When('add {string} to Cart', async function (productName) {
  const product = this.poManager.dashboardPage.getProductByName(productName);
  await this.poManager.dashboardPage.addProductToCart(product);
  await this.poManager.dashboardPage.goToCart();
});

Then('verify {string} is displayed in the Cart', async function (product) {
  const cartItem = this.poManager.cartPage.getItem(product);
  expect(await this.poManager.cartPage.getItemName(cartItem)).toBe(product);
  await this.poManager.cartPage.goToCheckout();
});

When('enter valid details and place the order', async function () {
  await this.poManager.orderPage.creditCardCVVCode.fill('666');
  await this.poManager.orderPage.couponInput.fill('rahulshettyacademy');
  await this.poManager.orderPage.couponApplyButton.click();
  await expect(this.poManager.orderPage.couponConfirmedLabel).toBeVisible();
  await this.poManager.orderPage.shippingCountry.pressSequentially('ukr', {
    delay: 100,
  });
  await this.poManager.orderPage.dropdownCountries.waitFor();
  await this.poManager.orderPage.selectCountry('Ukraine').click();
  await this.poManager.orderPage.placeOrderButton.click();
  this.orderNumber = (await this.poManager.confirmationPage.orderNumber).match(
    /\w+/
  );
});

Then('verify order is present in the Order History', async function () {
  await this.poManager.confirmationPage.goToOrdersHistoryButton.click();
  await expect(this.poManager.ordersHistoryPage.ordersIdsColumn).toContainText(
    this.orderNumber
  );
});

Given('login page is opened', async function () {
  await this.page.goto('https://rahulshettyacademy.com/loginpagePractise/');
});

When(
  'login to Ecommerce2 application with {string} and {string}',
  async function (username, password) {
    await this.page.locator('#username').fill(username);
    await this.page.locator("[type='password']").fill(password);
    await this.page.locator('#signInBtn').click();
  }
);

Then('verify error message is displayed', async function () {
  await expect(this.page.locator("[style*='none']")).toContainText('Incorrect');
});
