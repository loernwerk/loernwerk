import { test, expect } from '@playwright/test';

test('TZ1', async ({ page }) => {
    await page.goto('./');
    await page.getByText('Anmelden').click();
    await expect(page).toHaveURL(/.*login/);

    await page.getByPlaceholder('Benutzername/E-Mail').click();
    await page.getByPlaceholder('Benutzername/E-Mail').fill('lehrkraft');
    await page.getByPlaceholder('Passwort').click();
    await page.getByPlaceholder('Passwort').fill('12345678');
    await page.getByText('Anmelden', { exact: true }).click();
    await expect(page).toHaveURL(/.*overview/);

    await page.getByText('Lernsequenz erstellen').click();
    await page.getByPlaceholder('Name der Sequenz').click();
    await page.getByPlaceholder('Name der Sequenz').fill('TZ1_NeueSequenz');
    await page.getByText('Erstellen', { exact: true }).click();
    await expect(page).toHaveURL(/.*edit.*/);
});
