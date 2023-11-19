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
    return this.products.nth(
      Math.floor(Math.random() * (await this.products.count()))
    );
  }

  async getProductName(product) {
    return product.locator('b').textContent();
  }

  async getProductPrice(product) {
    return product.locator('div.text-muted').textContent();
  }

  addProductToCart(product) {
    return product.getByRole('button', { name: ' Add To Cart' }).click();
  }

  getCartItemsNumbers() {
    return this.cartButton.locator('label');
  }

  goToCart() {
    return this.cartButton.click();
  }
}
