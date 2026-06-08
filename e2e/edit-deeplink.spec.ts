import { test, expect } from '@playwright/test';

// Well-known OSM node: Pražský hrad (Prague Castle)
const NODE_ID = '1601837931';
const FEATURE_URL = `/node/${NODE_ID}`;
const EDIT_URL = `/node/${NODE_ID}/edit`;

test.describe('Edit dialog deep link', () => {
  test('opens dialog when navigating directly to /node/:id/edit', async ({
    page,
  }) => {
    await page.goto(EDIT_URL);
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 15_000 });
  });

  test('URL reverts to /node/:id when dialog is closed', async ({ page }) => {
    await page.goto(EDIT_URL);
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 15_000 });

    // Close: dialog is not modified so Escape works
    await page.keyboard.press('Escape');

    await expect(page).toHaveURL(new RegExp(`/node/${NODE_ID}$`), {
      timeout: 5_000,
    });
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('clicking Edit button updates URL to /node/:id/edit', async ({
    page,
  }) => {
    await page.goto(FEATURE_URL);

    // Wait for the edit/note button (text differs by auth status)
    const editButton = page.getByRole('button', {
      name: /Suggest an edit|Edit place|Add a place/i,
    });
    await expect(editButton).toBeVisible({ timeout: 20_000 });
    await editButton.click();

    await expect(page).toHaveURL(new RegExp(`/node/${NODE_ID}/edit$`), {
      timeout: 5_000,
    });
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });
});
