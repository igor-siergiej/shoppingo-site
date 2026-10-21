import { expect, test } from '@playwright/test';

test('homepage renders the pitch, links to the app and has no console errors @smoke', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(page).toHaveTitle(/Tandra/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/shared shopping list/i);
    await expect(page.getByRole('link', { name: 'Open Tandra' })).toHaveAttribute('href', /^https:\/\//);
    await expect(page.getByRole('link', { name: 'Try it without an account' })).toHaveAttribute(
        'href',
        /^https:\/\/.+\/try$/
    );
    await expect(page.getByRole('heading', { level: 2, name: 'From a link to a list' })).toBeVisible();
    expect(errors).toEqual([]);
});

test('FAQ answers open on click', async ({ page }) => {
    await page.goto('/');

    const question = page.getByText('Does it work without signal in the shop?');
    await question.click();

    await expect(page.getByText(/tick items off with no connection/)).toBeVisible();
});
