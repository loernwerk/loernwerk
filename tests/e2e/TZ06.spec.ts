import { test, expect } from '@playwright/test';

test('TZ06', async ({ page }) => {
    await page.goto('./');
    await page.getByText('Anmelden').click();
    await expect(page).toHaveURL(/.*login/);

    await page.getByPlaceholder('Benutzername/E-Mail').click();
    await page.getByPlaceholder('Benutzername/E-Mail').fill('lehrkraft');
    await page.getByPlaceholder('Passwort').click();
    await page.getByPlaceholder('Passwort').fill('12345678');
    await page.getByText('Anmelden', { exact: true }).click();
    await expect(page).toHaveURL(/.*overview/);

    await page
        .locator(
            'div:nth-child(2) > div:nth-child(2) > div > .mt-2 > div > div > div:nth-child(2) > div > .space-y-2 > div:nth-child(3) > .flex-1 > .relative > .p-2 > div'
        )
        .first()
        .click();
    await expect(page).toHaveURL(/.*edit.*/);

    await page.getByText('Speichern').click();
    await expect(page).toHaveURL(/.*overview/);

    await page
        .locator(
            'div:nth-child(2) > div:nth-child(2) > div > .mt-2 > div > div > div:nth-child(2) > div > .space-y-2 > div:nth-child(3) > div:nth-child(2) > .relative > .p-2 > div > .svg-inline--fa > path'
        )
        .click();

    expect(await page.getByText('Mit Teilnehmenden teilen').isVisible()).toBe(
        true
    );
});
