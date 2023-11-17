export default class DashboardPage {
  constructor(page) {
    this.products = page.locator('.card-body');
    this.productsText = page.locator('.card-body b');
    this.cartButton = page.getByRole('button', { name: ' Cart' });
  }

  async searchProduct(productName) {
    await this.productsText.first().waitFor();
    return (await this.productsText.allTextContents()).includes(productName);
  }

  async getRandomProduct() {
    this.product = this.products.nth(
      Math.floor(Math.random() * (await this.products.count()))
    );
  }

  async getProductName() {
    return this.product.locator('b').textContent();
  }

  async getProductPrice() {
    return this.product.locator('div.text-muted').textContent();
  }

  getCartItemsNumbers() {
    return this.cartButton.locator('label');
  }

  addProductToCart() {
    return this.product.getByRole('button', { name: ' Add To Cart' }).click();
  }

  goToCart() {
    return this.cartButton.click();
  }
}
