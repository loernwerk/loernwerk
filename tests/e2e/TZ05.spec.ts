import { test, expect } from '@playwright/test';
import { ISlide } from '../../model/slide/ISlide';

test('test', async ({ page, browserName }) => {
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
    await page
        .locator(
            'div:nth-child(3) > div > div > div:nth-child(2) > div > .space-y-2 > div:nth-child(3) > .flex-1 > .relative > .p-2'
        )
        .click();
    await page.locator('.grid > div:nth-child(2) > div > div > div').click();
    await page.getByRole('textbox').click();
    await page
        .getByRole('textbox')
        .fill(
            `https://www.youtube.com/embed/dsHyUgGMht0?bowser=${browserName}`
        );
    await page.getByRole('heading', { name: 'Seite' }).nth(1).click();
    await page
        .locator('div')
        .filter({ hasText: /^Speichern$/ })
        .nth(2)
        .click();

    await page.waitForURL('/overview');

    const editedSlide = (await fetch(
        'http://localhost:5000/api/sequence/FCBEEB/view/0'
    ).then((res) => res.json())) as ISlide;
    expect(editedSlide).toBeDefined();

    expect(editedSlide.content[1].url).toBe(
        `https://www.youtube.com/embed/dsHyUgGMht0?bowser=${browserName}`
    );
});
