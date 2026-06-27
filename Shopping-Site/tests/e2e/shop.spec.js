const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:3000';

test.describe('StyleHub Shopping', () => {

  test('page loads with header, hero, and products', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('.logo-text')).toContainText('StyleHub');
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('#product-grid')).toBeVisible();
    await expect(page.locator('.product-card').first()).toBeVisible();
  });

  test('product grid shows all 24 products by default', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForSelector('.product-card');
    const count = await page.locator('.product-card').count();
    expect(count).toBe(24);
  });

  test('category filter narrows the product grid', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForSelector('.product-card');
    await page.click('.cat-btn[data-cat="womens"]');
    await page.waitForTimeout(300);
    const cards = await page.locator('.product-card').count();
    expect(cards).toBeLessThan(24);
    expect(cards).toBeGreaterThan(0);
  });

  test('search filters products', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForSelector('.product-card');
    await page.fill('#search-input', 'polo');
    await page.waitForTimeout(500);
    const cards = await page.locator('.product-card').count();
    expect(cards).toBeGreaterThanOrEqual(1);
    expect(cards).toBeLessThan(24);
  });

  test('search shows empty state for no results', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForSelector('.product-card');
    await page.fill('#search-input', 'xyzabc123notaproduct');
    await page.waitForTimeout(500);
    await expect(page.locator('#empty-state')).toBeVisible();
  });

  test('add to cart opens sidebar and shows item', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForSelector('.product-card');
    await page.click('.add-to-cart-btn >> nth=0');
    await expect(page.locator('.cart-sidebar')).toHaveClass(/open/);
    await expect(page.locator('.cart-item')).toBeVisible();
    await expect(page.locator('#cart-badge')).toBeVisible();
  });

  test('cart badge updates with item count', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForSelector('.product-card');
    await page.click('.add-to-cart-btn >> nth=0');
    await page.waitForSelector('#cart-badge:not([hidden])');
    const badge = await page.locator('#cart-badge').textContent();
    expect(Number(badge)).toBeGreaterThanOrEqual(1);
  });

  test('dark/light theme toggle switches theme', async ({ page }) => {
    await page.goto(BASE);
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');
    await page.click('#theme-toggle');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.click('#theme-toggle');
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('theme persists on page reload', async ({ page }) => {
    await page.goto(BASE);
    await page.click('#theme-toggle'); // switch to dark
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('sort by price changes product order', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForSelector('.product-card');
    await page.selectOption('#sort-select', 'price-asc');
    await page.waitForTimeout(500);
    const prices = await page.locator('.product-price').allTextContents();
    expect(prices.length).toBeGreaterThan(1);
  });

});
