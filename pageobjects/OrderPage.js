export default class OrderPage {
  #itemDetails;
  #paymentMethod;
  #creditCardNumber;
  #creditCardCVVCode;
  #couponInput;
  #couponApplyButton;
  #couponConfirmedLabel;
  #shippingUsername;
  #shippingCountry;
  #dropdownCountries;
  #placeOrderButton;

  constructor(page) {
    this.#itemDetails = page.locator('div.item__details');
    this.#paymentMethod = page.getByText('Credit Card', { exact: true });
    this.#creditCardNumber = page.locator(
      ":text('Credit Card Number') + input"
    );
    this.#creditCardCVVCode = page.locator(":text('CVV Code ?') + input");
    this.#couponInput = page.locator(":text('Apply Coupon') + input");
    this.#couponApplyButton = page.getByRole('button', {
      name: 'Apply Coupon',
    });
    this.#couponConfirmedLabel = page.getByText('* Coupon Applied');
    this.#shippingUsername = page.locator('div.user__name > label');
    this.#shippingCountry = page.getByPlaceholder('Select Country');
    this.#dropdownCountries = page.locator('section.ta-results');
    this.#placeOrderButton = page.getByText('Place Order');
  }

  getItemName() {
    return this.#itemDetails.locator('div.item__title').textContent();
  }

  getItemPrice() {
    return this.#itemDetails.locator('div.item__price').textContent();
  }

  getItemQuantity() {
    return this.#itemDetails.locator('div.item__quantity').textContent();
  }

  getItemDescription() {
    return this.#itemDetails.locator('div.item__description').textContent();
  }

  get paymentMethod() {
    return this.#paymentMethod;
  }

  get creditCardNumber() {
    return this.#creditCardNumber;
  }

  get creditCardCVVCode() {
    return this.#creditCardCVVCode;
  }

  get couponInput() {
    return this.#couponInput;
  }

  get couponApplyButton() {
    return this.#couponApplyButton;
  }

  get couponConfirmedLabel() {
    return this.#couponConfirmedLabel;
  }

  get shippingUsernam() {
    return this.#shippingUsername;
  }

  get shippingCountry() {
    return this.#shippingCountry;
  }

  get dropdownCountries() {
    return this.#dropdownCountries;
  }

  selectCountry(country) {
    return this.#dropdownCountries.locator('span').filter({
      hasText: country,
    });
  }

  get placeOrderButton() {
    return this.#placeOrderButton;
  }
}
