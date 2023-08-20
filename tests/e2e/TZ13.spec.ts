import { test, expect } from '@playwright/test';

test('TZ13', async ({ page, browserName, context }) => {
    await context.clearCookies();
    await page.goto('./');
    await page.getByText('Anmelden').click();

    expect(page).toHaveURL(/.*login/);
    await page.getByPlaceholder('Benutzername/E-Mail').click();
    await page.getByPlaceholder('Benutzername/E-Mail').fill('admin');
    await page.getByPlaceholder('Passwort').click();
    await page.getByPlaceholder('Passwort').fill('12345678');
    const responsePromise = page.waitForResponse(
        'http://localhost:5000/api/account/login'
    );
    await page.getByText('Anmelden', { exact: true }).click();
    await responsePromise;
    expect(page).toHaveURL(/.*overview/);

    await page.getByRole('link', { name: 'Admin' }).click();
    expect(page).toHaveURL(/.*admin/);

    const username = `TZ12-13-tobeedited-tobedeleted-${browserName}`;

    await page.getByText(username).click();
    const deleteResponsePromise = page.waitForResponse(
        'http://localhost:5000/api/account/'
    );
    await page.getByText('Löschen').click();
    await deleteResponsePromise;
    expect(
        await page
            .locator('.w-full > div > div:nth-child(2)')
            .first()
            .allInnerTexts()
    ).not.toContain(username);
});
