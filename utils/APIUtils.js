import { expect } from '@playwright/test';

export default class APIUtils {
  #apiContext;
  #loginPayload;

  constructor(apiContext, loginPayload) {
    this.#apiContext = apiContext;
    this.#loginPayload = loginPayload;
  }

  async getToken() {
    const loginResponse = await this.#apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/auth/login',
      {
        data: this.#loginPayload,
      }
    );

    await expect(loginResponse).toBeOK();

    return (await loginResponse.json()).token;
  }

  async createOrder(orderPayload) {
    const response = {};
    response.authToken = await this.getToken(this.#loginPayload);

    const orderResponse = await this.#apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
        data: orderPayload,
        headers: {
          Authorization: response.authToken,
          'Contenst-Type': 'application/json',
        },
      }
    );

    await expect(orderResponse).toBeOK();
    response.orderId = (await orderResponse.json()).orders[0];

    return response;
  }
}
