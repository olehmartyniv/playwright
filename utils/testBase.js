import base from '@playwright/test';

export const customTest = base.extend({
  placeOrderData: {
    username: 'test002@mail.com',
    password: 'P@ss0002',
    country: 'Ukraine',
  },
});
