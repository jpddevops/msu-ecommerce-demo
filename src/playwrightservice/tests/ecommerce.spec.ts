import { test, expect } from '@playwright/test';

test('Has title', async ({ page }) => {
  await page.goto('http://a5c5da65455134b8185490aa6edba558-22a0dbff28683902.elb.us-east-1.amazonaws.com/ecommerce/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Online Boutique/);
});


test('Add to Cart and Checkout', async ({ page }) => {
  await page.goto('http://a5c5da65455134b8185490aa6edba558-22a0dbff28683902.elb.us-east-1.amazonaws.com/ecommerce/');

  let productSelector = Math.floor(Math.random() * 8) + 3;
  const randomTimes = Math.floor(Math.random() * 3) + 1;

// Loop the random number of times
  for (let i = 0; i < randomTimes; i++) {
    // Code to be executed inside the loop

    await page.locator(`div:nth-child(${productSelector}) > a`).click();
    await page.getByRole('button', { name: 'Add To Cart' }).click();

    productSelector = Math.floor(Math.random() * 8) + 3;

    // Back to home
    await page.getByRole('banner').getByRole('link').first().click();

  }

// To Cart
  await page.getByRole('link', { name: 'Cart' }).click();

// Checkout
  await page.getByRole('button', { name: 'Place Order' }).click();

});



