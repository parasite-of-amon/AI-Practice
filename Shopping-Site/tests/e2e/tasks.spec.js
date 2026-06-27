const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:3000';

test.describe('Task management', () => {
  test('page loads and shows empty state', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('h1')).toContainText('TaskBoard');
    await expect(page.locator('#task-list')).toContainText('No tasks yet');
  });

  test('user can create a task', async ({ page }) => {
    await page.goto(BASE);
    await page.fill('#task-title', 'E2E test task');
    await page.selectOption('#task-priority', 'high');
    await page.click('button[type="submit"]');
    await expect(page.locator('.task-card')).toContainText('E2E test task');
    await expect(page.locator('.badge-high')).toBeVisible();
  });

  test('user can edit a task', async ({ page }) => {
    await page.goto(BASE);
    await page.fill('#task-title', 'Before edit');
    await page.click('button[type="submit"]');
    await page.click('.btn-ghost:has-text("Edit")');
    await page.fill('#modal-title', 'After edit');
    await page.selectOption('#modal-status', 'done');
    await page.click('#modal-form button[type="submit"]');
    await expect(page.locator('.task-card')).toContainText('After edit');
    await expect(page.locator('.badge-done')).toBeVisible();
  });

  test('user can delete a task', async ({ page }) => {
    await page.goto(BASE);
    await page.fill('#task-title', 'To be deleted');
    await page.click('button[type="submit"]');
    page.once('dialog', d => d.accept());
    await page.click('.btn-danger');
    await expect(page.locator('#task-list')).toContainText('No tasks yet');
  });
});
