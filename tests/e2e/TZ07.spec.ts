import { test, expect } from '@playwright/test';
import { IUser } from '../../model/user/IUser';
import axios from 'axios';

const browserAccountMap: Record<string, string> = {
    chromium: 'TZ7-1',
    firefox: 'TZ7-2',
    webkit: 'TZ7-3',
};

test('TZ07', async ({ page, browserName, context }) => {
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

    await page.waitForTimeout(5000);

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

    const responsePromise = page.waitForResponse(
        'http://localhost:5000/api/account/'
    );
    await page
        .locator('div')
        .filter({ hasText: /^Speichern$/ })
        .nth(2)
        .click();
    await responsePromise;

    expect(page.getByText('Benutzer gespeichert')).toBeDefined();

    const loernwerkCookie = (await context.cookies()).find(
        (cookie) => cookie.name === 'loernwerk.session'
    )?.value as string;
    const account = await axios.get('http://localhost:5000/api/account/', {
        headers: { cookie: 'loernwerk.session=' + loernwerkCookie },
    });
    expect(account.status).toBe(200);
    const accountJson = account.data as IUser;
    expect(accountJson.name).toBe(`lehrkraft-${browserName}`);
    expect(accountJson.mail).toBe(`lehrkraft-${browserName}@loernwerk.de`);
});
