import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('./');
    await page.getByText('Anmelden').click();
    await page.getByPlaceholder('Benutzername/E-Mail').click();
    await page.getByPlaceholder('Benutzername/E-Mail').fill('lehrkraft');
    await page.getByPlaceholder('Passwort').click();
    await page.getByPlaceholder('Passwort').fill('12345678');
    await page.getByText('Anmelden', { exact: true }).click();
    await page
        .locator(
            'div:nth-child(2) > div > div > div:nth-child(2) > div > .space-y-2 > div:nth-child(3) > .flex-1 > .relative > .p-2 > div'
        )
        .first()
        .click();
    await page.locator('.h-full > .flex').first().click();
    await page.getByRole('slider').click();
    await page.getByRole('slider').click();
    await page.getByRole('slider').fill('0.4');

    //expect(page.locator('//*[@id="app"]//p[2]').innerHTML()).toEqual('40%');
    await expect(page.getByText('40%')).toBeVisible();
    await page.getByRole('heading', { name: 'Seite' }).nth(1).click();
    await page.getByText('Speichern').click();
    await page
        .locator(
            'div:nth-child(2) > div > div > div:nth-child(2) > div > .space-y-2 > div:nth-child(3) > div:nth-child(2) > .relative > .p-2'
        )
        .click();
    await page
        .getByRole('heading', { name: 'Mit Teilnehmenden teilen' })
        .click();

    await expect(
        page
            .locator('div')
            .filter({ hasText: /^Code der Sequenz:$/ })
            .getByRole('textbox')
    ).toBeVisible();
    await expect(
        page
            .locator('div')
            .filter({ hasText: /^Link der Sequenz:$/ })
            .getByRole('textbox')
    ).toBeVisible();
});
