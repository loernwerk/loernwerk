import { test, expect } from '@playwright/test';
import { ISlide } from '../../model/slide/ISlide';
import { TextContent } from '../../model/slide/content/TextContent';
import axios from 'axios';

test('TZ02', async ({ page }) => {
    await page.goto('./');
    await page.getByText('Anmelden').click();
    await expect(page).toHaveURL(/.*login/);

    await page.getByPlaceholder('Benutzername/E-Mail').click();
    await page.getByPlaceholder('Benutzername/E-Mail').fill('lehrkraft');
    await page.getByPlaceholder('Passwort').click();
    await page.getByPlaceholder('Passwort').fill('123456789');
    const responsePromise = page.waitForResponse(
        'http://localhost:5000/api/account/login'
    );
    await page.getByText('Anmelden', { exact: true }).click();
    await responsePromise;
    expect(await page.locator('div').allInnerTexts()).toContain(
        'Falscher Benutzername/E-Mail oder Passwort'
    );
    expect(page).toHaveURL(/.*login/);

    await page.getByPlaceholder('Passwort').click();
    await page.getByPlaceholder('Passwort').fill('12345678');
    await page.getByText('Anmelden', { exact: true }).click();
    await page.waitForURL(/.*overview/);

    await page.locator('.flex-1 > .relative > .p-2 > div').first().click();
    await page.waitForURL(/.*edit/);
    expect(page).toHaveURL(/.*edit/);

    await page
        .locator('div:nth-child(2) > div > div > div > #editor > .ql-editor')
        .fill('');
    expect(await page.locator('p').allInnerTexts()).not.toContain(
        'Einen kurzen Satz'
    );
    expect(await page.locator('p').allInnerTexts()).not.toContain(
        'In anderer Schriftart'
    );

    await page.keyboard.type('Einen kurzen Satz\n\n\n\n');
    await page.getByRole('combobox').nth(1).selectOption('Times New Roman');
    await page
        .locator('div:nth-child(2) > div > div > div > #editor > .ql-editor')
        .click();
    await page.keyboard.type('In anderer Schriftart');
    expect(await page.locator('p').allInnerTexts()).toContain(
        'Einen kurzen Satz'
    );
    expect(await page.locator('p').allInnerTexts()).toContain(
        'In anderer Schriftart'
    );

    await page.getByRole('heading', { name: 'Seite' }).nth(1).click();
    await page.getByText('Speichern').click();
    await page.waitForURL(/.*overview/);

    const contents = (
        await axios.get('http://localhost:5000/api/sequence/CDDAEF/view/0')
    ).data as ISlide;
    expect((contents.content[1] as TextContent).delta).toEqual({
        ops: [
            { insert: 'Einen kurzen Satz\n\n\n\n' },
            {
                insert: 'In anderer Schriftart',
                attributes: { font: 'Times New Roman' },
            },
            { insert: '\n' },
        ],
    });
});
