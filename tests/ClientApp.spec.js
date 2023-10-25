import { test, expect } from '@playwright/test';

test('First practice', async function ({ page }) {
  // open register page
  await page.goto('https://rahulshettyacademy.com/client/');
  // register
  const counter = 4;
  /*
  await page.locator('.text-reset').click();
  await page.locator('#firstName').fill(`testF${counter}`);
  await page.locator('#lastName').fill(`testL${counter}`);
  await page.locator('#userEmail').fill(`test00${counter}@mail.com`);
  await page.locator('#userMobile').fill(`100000000${counter}`);
  await page.locator('#userPassword').fill(`P@ss000${counter}`);
  await page.locator('#confirmPassword').fill(`P@ss000${counter}`);
  await page.locator("[type='checkbox']").check();
  await page.locator('#login').click();
  // go to login
  await expect(page.locator('h1.headcolor')).toBeAttached();
  await expect(page.locator('h1.headcolor')).toHaveText(
    'Account Created Successfully'
  );
  await page.locator("[routerlink='/auth']").click();
  */
  // login
  await page.locator('#userEmail').fill(`test00${counter}@mail.com`);
  await page.locator('#userPassword').fill(`P@ss000${counter}`);
  await page.locator('#login').click();
  // get first title
  // await page.waitForLoadState('networkidle');
  await page.locator('h5 > b').first().waitFor();
  console.log(await page.locator('h5 > b').allTextContents());
  await expect(page.locator('h5 > b').first()).toHaveText('zara coat 3');
});

test('E2E scenario', async function ({ page }) {
  const extractNumber = priceValue => +priceValue.match(/\d+/);

  const username = 'test000@mail.com';
  const country = 'Ukraine';

  await page.goto('https://rahulshettyacademy.com/client/');
  // login
  await page.locator('#userEmail').fill(username);
  await page.locator('#userPassword').fill('P@ss0000');
  await page.locator('#login').click();

  // add to cart
  await expect(page).toHaveURL(/dash$/);
  await expect(
    page.locator('#sidebar').getByText('Home | Search')
  ).toBeVisible();

  const products = page.locator('div.card-body');
  const cartButton = page.getByRole('button', { name: ' Cart' });
  const product = products.nth(
    Math.floor(Math.random() * (await products.count()))
  );

  const productName = await product.locator('b').textContent();
  const productPrice = extractNumber(
    await product.locator('div.text-muted').textContent()
  );

  await expect(cartButton.locator('label')).toHaveText('');
  await product.getByRole('button', { name: ' Add To Cart' }).click();
  await expect(cartButton.locator('label')).toHaveText('1');
  await cartButton.click();

  // cart
  await expect(page).toHaveURL(/cart$/);
  await expect(page.getByRole('heading', { name: 'My Cart' })).toBeVisible();

  await expect(page.getByRole('heading', { name: productName })).toBeVisible();
  const cartItem = page
    .locator('div.cart > ul > li')
    .filter({ hasText: productName });

  await expect(cartItem.locator('h3')).toHaveText(productName);
  expect(
    extractNumber(await cartItem.locator('div.prodTotal > p').textContent())
  ).toBe(productPrice);
  await page.getByRole('button', { name: 'Checkout' }).click();

  // checkout
  await expect(page).toHaveURL(/order/);
  await expect(page.getByText('Payment Method')).toBeVisible();

  const itemDetails = page.locator('div.item__details');

  await expect(itemDetails.locator('div.item__title')).toHaveText(productName);
  await expect(
    extractNumber(await itemDetails.locator('div.item__price').textContent())
  ).toBe(productPrice);
  await expect(itemDetails.locator('div.item__quantity')).toHaveText(
    'Quantity: 1'
  );
  await expect(itemDetails.locator('div.item__description')).toHaveText(
    productName
  );

  await expect(page.getByText('Credit Card', { exact: true })).toHaveClass(
    /active/
  );
  await expect(page.locator(":text('Credit Card Number') + input")).toHaveValue(
    '4542 9931 9292 2293'
  );
  await page.locator(":text('CVV Code ?') + input").fill('666');
  await page
    .locator(":text('Apply Coupon') + input")
    .fill('rahulshettyacademy');
  await page.getByRole('button', { name: 'Apply Coupon' }).click();
  await expect(page.getByText('* Coupon Applied')).toBeVisible();

  await expect(page.locator('div.user__name > label')).toHaveText(username);
  await page
    .getByPlaceholder('Select Country')
    .pressSequentially('ukr', { delay: 100 });

  const dropdown = page.locator('section.ta-results');
  await dropdown.waitFor();
  await dropdown.locator('span').filter({ hasText: country }).click();
  await page.getByText('Place Order').click();

  // verify completion
  await expect(page).toHaveURL(/thanks/);
  await expect(
    page.getByRole('heading', { name: 'Thankyou for the order.' })
  ).toBeVisible();

  const orderNumber = (
    await page.locator('td > label').last().textContent()
  ).match(/\w+/);
  await page.getByText('Orders History Page').click();

  // find order
  await expect(page).toHaveURL(/myorders$/);
  await expect(page.getByText('Your Orders')).toBeVisible();

  await expect(page.locator("th[scope='row']")).toContainText(orderNumber);
  await page
    .getByRole('row')
    .filter({ hasText: orderNumber })
    .getByRole('button', { name: 'View' })
    .click();

  // verify order
  await expect(page).toHaveURL(/order-details/);
  await expect(page.getByText('order summary')).toBeVisible();

  await expect(page.locator('div.col-text')).toHaveText(orderNumber);
});
