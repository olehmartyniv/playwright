import { expect } from '@playwright/test';

export default class APIUtils2 {
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
    const orderResponse = await this.#apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
        data: orderPayload,
        headers: {
          Authorization: await this.getToken(),
          'Contenst-Type': 'application/json',
        },
      }
    );

    await expect(orderResponse).toBeOK();

    return (await orderResponse.json()).orders[0];
  }
}
