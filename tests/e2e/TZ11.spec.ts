import { test, expect } from '@playwright/test';
import axios from 'axios';
import { IUser } from '../../model/user/IUser';

test('TZ11', async ({ page, browserName, context }) => {
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
    await page.waitForURL(/.*admin/);
    await expect(page).toHaveURL(/.*admin/);

    await page.getByText('Benutzer erstellen').click();
    expect(await page.getByText('Benutzer erstellen:').isVisible()).toBe(true);

    await page.getByPlaceholder('Benutzername').click();
    await page.getByPlaceholder('Benutzername').fill('TZ11-' + browserName);
    await page.getByPlaceholder('E-Mail').click();
    await page.getByPlaceholder('E-Mail').fill('tz11-' + browserName + '@x.de');
    await page.getByPlaceholder('E-Mail').press('Tab');
    await page.getByPlaceholder('Passwort', { exact: true }).fill('12345678');
    await page.getByPlaceholder('Passwort wiederholen').click();
    await page.getByPlaceholder('Passwort wiederholen').fill('12345678');
    const responsePromise = page.waitForResponse(
        'http://localhost:5000/api/account/'
    );
    await page.getByText('Erstellen', { exact: true }).click();
    await responsePromise;
    expect(await page.getByText('Benutzer erstellt').isVisible()).toBe(true);

    const loernwerkCookie = (await context.cookies()).find(
        (cookie) => cookie.name === 'loernwerk.session'
    )?.value as string;
    const users = (
        await axios.get('http://localhost:5000/api/account/list', {
            headers: { cookie: 'loernwerk.session=' + loernwerkCookie },
        })
    ).data as IUser[];
    expect(
        users.some((value) => value.name === 'TZ11-' + browserName)
    ).toBeTruthy();
});
