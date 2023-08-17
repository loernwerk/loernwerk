import { test, expect } from '@playwright/test';

test('TZ11', async ({ page }) => {
    await page.goto('./');
    await page.getByText('Anmelden').click();
    await expect(page).toHaveURL(/.*login/);

    await page.getByPlaceholder('Benutzername/E-Mail').click();
    await page.getByPlaceholder('Benutzername/E-Mail').fill('admin');
    await page.getByPlaceholder('Passwort').click();
    await page.getByPlaceholder('Passwort').fill('12345678');
    await page.getByText('Anmelden', { exact: true }).click();
    await expect(page).toHaveURL(/.*overview/);

    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page).toHaveURL(/.*admin/);

    await page.getByText('Benutzer erstellen').click();
    const elementAccountCreationContainer = page.getByText('Benuter erstellt');
    expect(elementAccountCreationContainer !== undefined).toBeTruthy();

    await page.getByPlaceholder('Benutzername').click();
    await page.getByPlaceholder('Benutzername').fill('TZ11');
    await page.getByPlaceholder('E-Mail').click();
    await page.getByPlaceholder('E-Mail').fill('tz11@x.de');
    await page.getByPlaceholder('E-Mail').press('Tab');
    await page.getByPlaceholder('Passwort', { exact: true }).fill('12345678');
    await page.getByPlaceholder('Passwort wiederholen').click();
    await page.getByPlaceholder('Passwort wiederholen').fill('12345678');
    await page.getByText('Erstellen', { exact: true }).click();

    const elementSuccessMessage = page.getByText('Benuter erstellt');
    expect(elementSuccessMessage !== undefined).toBeTruthy();
});
