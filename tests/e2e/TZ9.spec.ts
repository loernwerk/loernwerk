import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://main.loernwerk.de/');
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('BDECFA');
    await page.getByText('Weiter').click();

    expect(page.url).toEqual('https://main.loernwerk.de/BDECFA');

    await page
        .frameLocator('iframe[title="H5P"]')
        .getByRole('radio', { name: ' Ja' })
        .click();
    await page
        .frameLocator('iframe[title="H5P"]')
        .getByLabel(
            'Die Antworten überprüfen. Die Auswahlen werden als richtig, falsch oder fehlend markiert.'
        )
        .click();
    await page.getByText('Weiter').click();
    await page.getByText('Weiter').click();
    await page.getByText('Weiter').click();
    await page.getByText('Weiter').click();
    await page.getByText('Weiter').click();

    expect(page.url).toEqual('https://main.loernwerk.de/BDECFA/finished');

    let pagePromiseResolved = false;
    let downloadPromiseResolved = false;

    const page1Promise = page.waitForEvent('popup');
    const downloadPromise = page.waitForEvent('download');
    await page.getByText('Teilnahmezertifikat').click();
    const page1 = await page1Promise;
    const download = await downloadPromise;

    page1.then(function () {
        pagePromiseResolved = true;
    });
    download.then(function () {
        downloadPromiseResolved = true;
    });

    expect(pagePromiseResolved).toBeTruthy();
    expect(downloadPromiseResolved).toBeTruthy();
});
