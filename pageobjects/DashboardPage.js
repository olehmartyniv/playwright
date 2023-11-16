import { expect } from '@playwright/test';

export default class DashboardPage {
  constructor(page) {
    this.products = page.locator('.card-body');
    this.productsText = page.locator('.card-body b');
    this.cart = page.getByRole('button', { name: ' Cart' });
  }

  async searchProduct(productName) {
    await this.productsText.first().waitFor();
    console.log(await this.productsText.allTextContents());
    await expect(this.productsText.first()).toHaveText(productName);
  }
}
