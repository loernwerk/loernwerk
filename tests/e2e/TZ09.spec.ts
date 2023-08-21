import { test, expect } from '@playwright/test';

test('TZ09', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('AFBFFF');

    await expect(page).toHaveURL(/AFBFFF/);

    await page
        .frameLocator('iframe[title="H5P"]')
        .getByRole('radio', { name: ' Eins' })
        .click();
    await page
        .frameLocator('iframe[title="H5P"]')
        .getByLabel(
            'Die Antworten überprüfen. Die Auswahlen werden als richtig, falsch oder fehlend markiert.'
        )
        .click();
    await page.getByText('Weiter').click();

    await expect(page).toHaveURL('/AFBFFF/finished');

    const download = await page.getByText('Teilnahmezertifikat');

    await expect(download).toBeVisible();

    await download.click();
});
