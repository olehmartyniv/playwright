export default class OrdersHistoryPage {
  #ordersIdsColumn;
  #goToOrderDetailsButton;

  constructor(page) {
    this.#ordersIdsColumn = page.locator("th[scope='row']");
    this.#goToOrderDetailsButton = page.getByRole('row');
  }

  get ordersIdsColumn() {
    return this.#ordersIdsColumn;
  }

  getGoToOrderDetailsButton(orderNumber) {
    return this.#goToOrderDetailsButton
      .filter({ hasText: orderNumber })
      .getByRole('button', { name: 'View' });
  }
}
