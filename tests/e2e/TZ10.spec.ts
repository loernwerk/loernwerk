import { test, expect } from '@playwright/test';

test('TZ10', async ({ page }) => {
    await page.goto('/AFBFFF');

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
});
