import { test } from '@playwright/test';

test('test', async ({ page, browserName }) => {
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

    // Go to Admin screen
    await page.getByRole('link', { name: 'Admin' }).click();

    // Select and modify user
    await page
        .locator('div:nth-child(4) > .p-0\\.5 > div > .relative > .p-2')
        .click();
    await page.getByPlaceholder('Benutzername').click();
    await page
        .getByPlaceholder('Benutzername')
        .fill(`TZ12-13-tobeedited-tobedeleted-${browserName}`);
    await page.getByPlaceholder('E-Mail').click();
    await page
        .getByPlaceholder('E-Mail')
        .fill(`TZ1213-${browserName}@kreativeemail.de`);
    await page.getByPlaceholder('Passwort', { exact: true }).click();
    await page
        .getByPlaceholder('Passwort', { exact: true })
        .fill(rightPad(browserName, 6));
    await page.getByPlaceholder('Passwort wiederholen').click();
    await page
        .getByPlaceholder('Passwort wiederholen')
        .fill(rightPad(browserName, 6));
    await page
        .locator('div')
        .filter({ hasText: /^Speichern$/ })
        .nth(2)
        .click();

    // Check if user was saved
    /*expect(await page.innerHTML('body')).toContain(`TZ12-13-tobeedited-tobedeleted-${browserName}`); /* uncomment this when reload fixed */
    //expect(await axios.get('http://localhost:5000/api/account?name=TZ12-13-tobeedited-tobedeleted-' + browserName, {withCredentials: true}).then(res => res.status)).toBe(200);

    //expect(await axios.get(`http://localhost:5000/api/account?mail=TZ1213-${browserName}@kreativeemail.de`, {withCredentials: true}).then(res => res.status)).toBe(200);
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
