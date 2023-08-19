import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('/');
    await page
        .locator('div')
        .filter({ hasText: /^Anmelden$/ })
        .nth(2)
        .click();
    await page.getByPlaceholder('Benutzername/E-Mail').click();
    await page.getByPlaceholder('Benutzername/E-Mail').fill('lehrkraft');
    await page.getByPlaceholder('Passwort').click();
    await page.getByPlaceholder('Passwort').fill('12345678');
    await page
        .locator('div')
        .filter({ hasText: /^Anmelden$/ })
        .nth(2)
        .click();

    // Locate ... on Sequence
    await page
        .locator(
            'div:nth-child(4) > div > div > div:nth-child(2) > div > .space-y-2 > div:nth-child(3) > div:nth-child(2) > .relative > .p-2'
        )
        .click();
    await page.getByPlaceholder('Schlüsselwörter').click();
    await page.getByPlaceholder('Schlüsselwörter').fill('Tag123');
    await page
        .locator('div')
        .filter({ hasText: /^Speichern$/ })
        .nth(3)
        .click();

    // Expect tag to be on sequence
    expect(page.getByText('Tag123')).toBeDefined();

    // Search for tag and remove it
    const searchBar = page.getByPlaceholder('Suche...');
    await searchBar.click();
    await searchBar.fill('Tag123');
    await page.locator('div:nth-child(2) > .relative > .p-2').click();
    await page.getByPlaceholder('Schlüsselwörter').click();
    await page.getByPlaceholder('Schlüsselwörter').fill('');
    await page
        .locator('div')
        .filter({ hasText: /^Speichern$/ })
        .nth(3)
        .click();
    await searchBar.click();
    await searchBar.fill('');

    // Expect tag to be removed from sequence
    expect(await page.innerHTML('body')).not.toContain('Tag123');
});
