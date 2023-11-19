export default class CartPage {
  constructor(page) {
    this.cartItems = page.locator('div.cart > ul > li');
    this.checkoutBtn = page.getByRole('button', { name: 'Checkout' });
  }

  getItem(productName) {
    return this.cartItems.filter({ hasText: productName });
  }

  getItemName(item) {
    return item.locator('h3').textContent();
  }

  getItemPrice(item) {
    return item.locator('div.prodTotal > p').textContent();
  }

  goToCheckout() {
    return this.checkoutBtn.click();
  }
}
