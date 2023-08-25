import { test, expect } from '@playwright/test';
import axios from 'axios';

test('TZ12', async ({ page, browserName, context }) => {
    await page.goto('/');
    await page
        .locator('div')
        .filter({ hasText: /^Anmelden$/ })
        .nth(2)
        .click();
    await page.getByPlaceholder('Benutzername/E-Mail').click();
    await page.getByPlaceholder('Benutzername/E-Mail').fill('admin');
    await page.getByPlaceholder('Passwort').click();
    await page.getByPlaceholder('Passwort').fill('12345678');
    await page
        .locator('div')
        .filter({ hasText: /^Anmelden$/ })
        .nth(2)
        .click();

    await page.waitForTimeout(5000);

    // Go to Admin screen
    await page.getByRole('link', { name: 'Admin' }).click();

    // Select and modify user
    await page
        .locator('div:nth-child(4) > .p-0\\.5 > div > .relative > .p-2')
        .click();

    await page.waitForTimeout(2000);

    await page.getByPlaceholder('Benutzername').click();
    await page.getByPlaceholder('Benutzername').fill(`TZ12-${browserName}`);
    await page.getByPlaceholder('E-Mail').click();
    await page
        .getByPlaceholder('E-Mail')
        .fill(`TZ12-${browserName}@kreativeemail.de`);
    await page.getByPlaceholder('Passwort', { exact: true }).click();
    await page
        .getByPlaceholder('Passwort', { exact: true })
        .fill(rightPad(browserName, 6));
    await page.getByPlaceholder('Passwort wiederholen').click();
    await page
        .getByPlaceholder('Passwort wiederholen')
        .fill(rightPad(browserName, 6));

    const responsePromise = page.waitForResponse(
        'http://localhost:5000/api/account/'
    );
    await page
        .locator('div')
        .filter({ hasText: /^Speichern$/ })
        .nth(2)
        .click();
    await responsePromise;

    // Check if user was saved
    expect(await page.innerHTML('body')).toContain(
        `TZ12-13-tobeedited-tobedeleted-${browserName}`
    );
    const loernwerkCookie = (await context.cookies()).find(
        (cookie) => cookie.name === 'loernwerk.session'
    )?.value as string;
    expect(
        (
            await axios.get(
                'http://localhost:5000/api/account/?name=TZ12-' + browserName,
                { headers: { cookie: 'loernwerk.session=' + loernwerkCookie } }
            )
        ).status
    ).toBe(200);
    expect(
        (
            await axios.get(
                'http://localhost:5000/api/account/?mail=TZ12-' +
                    browserName +
                    '@kreativeemail.de',
                { headers: { cookie: 'loernwerk.session=' + loernwerkCookie } }
            )
        ).status
    ).toBe(200);
});

/**
 * Adds 0 to the end of a string until it has the specified length
 * @param value String to be padded
 * @param length Number of characters the string should have
 * @returns Padded string
 */
function rightPad(value: string, length: number): string {
    return value.padEnd(length, '0');
}
