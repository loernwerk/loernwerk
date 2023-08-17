import { test, expect } from '@playwright/test';

test('TZ3', async ({ page }) => {
    await page.getByText('Bearbeiten').first().click();

    expect(page.url()).toEqual('https://main.loernwerk.de/edit/BDECFA');

    await page.locator('.w-auto').click();
    await page.getByRole('slider').click();
    await page.getByRole('slider').fill('0.44');

    expect(page.locator('//*[@id="app"]//p[2]').getText()).toEqual('44%');

    //this probably works differently on newest main
    await page.getByRole('heading', { name: 'Seite' }).nth(1).click();
    await page.getByText('Speichern').click();

    await page.goto('https://main.loernwerk.de/edit/BDECFA');
    await page.goto('https://main.loernwerk.de/overview');
    await page
        .locator('div')
        .filter({
            hasText:
                /^Meine Lernsequenzen:Loernwerk DemoBearbeitentestBearbeiten$/,
        })
        .locator('svg')
        .first()
        .click();
    await page
        .getByRole('heading', { name: 'Mit Teilnehmenden teilen' })
        .click();

    const code = page
        .locator('div')
        .filter({ hasText: /^Code der Sequenz:$/ })
        .getByRole('textbox');
    const link = page
        .locator('div')
        .filter({ hasText: /^Link der Sequenz:$/ })
        .getByRole('textbox');
    expect(code.getText()).toEqual('BDECFA');
    expect(link.getText()).toEqual('https://main.loernwerk.de/BDECFA');
});
