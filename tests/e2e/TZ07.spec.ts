import { test, expect } from '@playwright/test';

const browserAccountMap: Record<string, string> = {
    chromium: 'TZ7-1',
    firefox: 'TZ7-2',
    webkit: 'TZ7-3',
};

test('test', async ({ page, browserName }) => {
    await page.goto('/');
    await page
        .locator('div')
        .filter({ hasText: /^Anmelden$/ })
        .nth(2)
        .click();
    await page.getByPlaceholder('Benutzername/E-Mail').click();
    await page
        .getByPlaceholder('Benutzername/E-Mail')
        .fill(browserAccountMap[browserName]);
    await page.getByPlaceholder('Passwort').click();
    await page.getByPlaceholder('Passwort').fill('12345678');

    await page
        .locator('div')
        .filter({ hasText: /^Anmelden$/ })
        .nth(2)
        .click();

    await page.waitForURL('/overview');

    await page.locator('svg').nth(2).click();

    await page.waitForURL('/account');

    // Change data
    await page.getByPlaceholder('Benutzername').click();
    await page
        .getByPlaceholder('Benutzername')
        .fill(`lehrkraft-${browserName}`);
    await page.getByPlaceholder('E-Mail').click();
    await page
        .getByPlaceholder('E-Mail')
        .fill(`lehrkraft-${browserName}@loernwerk.de`);
    await page.getByPlaceholder('Passwort', { exact: true }).click();
    await page
        .getByPlaceholder('Passwort', { exact: true })
        .fill('${browsername}-12345');
    await page.getByPlaceholder('Passwort wiederholen').click();
    await page
        .getByPlaceholder('Passwort wiederholen')
        .fill('${browsername}-12345');
    await page
        .locator('div')
        .filter({ hasText: /^Speichern$/ })
        .nth(2)
        .click();

    expect(page.getByText('Benutzer gespeichert')).toBeDefined();
});
