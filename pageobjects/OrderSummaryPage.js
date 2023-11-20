export default class OrderSummaryPage {
  #orderId;

  constructor(page) {
    this.#orderId = page.locator('div.col-text');
  }

  get orderId() {
    return this.#orderId;
  }
}
