export default class ConfirmationPage {
  #orderNumber;
  #goToOrdersHistoryButton;

  constructor(page) {
    this.#orderNumber = page.locator('td > label');
    this.#goToOrdersHistoryButton = page.getByText('Orders History Page');
  }

  get orderNumber() {
    return this.#orderNumber.last().textContent();
  }

  get goToOrdersHistoryButton() {
    return this.#goToOrdersHistoryButton;
  }
}
