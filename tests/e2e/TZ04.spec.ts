import { test } from '@playwright/test';

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

    await page.waitForURL('/overview');

    // Create new sequence
    await page.locator('.p-2').first().click();
    await page.getByPlaceholder('Name der Sequenz').click();
    await page
        .getByPlaceholder('Name der Sequenz')
        .fill(`TZ4 - ${browserName}`);
    await page.locator('.w-fit > .relative > .p-2').first().click();

    // Create H5P Content
    await page.locator('img:nth-child(3)').click();
    await page
        .locator(
            '.grid > div:nth-child(2) > div > div > div > div > .h-full > .w-full'
        )
        .click();

    await page.waitForFunction(() => {
        return !!document
            .querySelector('iframe')
            ?.contentDocument?.querySelector('#h5p-multichoice');
    });

    await page
        .frameLocator('iframe')
        .getByRole('button', { name: 'Details', exact: true })
        .click();
    await page
        .frameLocator('iframe')
        .getByRole('button', { name: 'Benutzen' })
        .click();

    await page.waitForFunction(() => {
        return !!document
            .querySelector('iframe')
            ?.contentDocument?.querySelector(
                '.h5peditor-form-manager-title.multichoice'
            );
    });

    // Fill in field for H5P Content
    await page
        .frameLocator('iframe')
        .getByRole('textbox', { name: 'Title*' })
        .click();
    await page
        .frameLocator('iframe')
        .getByRole('textbox', { name: 'Title*' })
        .fill('Test Title');
    await page.frameLocator('iframe').locator('#field-question-15').click();
    await page.frameLocator('iframe').locator('#field-text-17').click();
    await page.frameLocator('iframe').locator('#field-correct-18').check();
    await page.frameLocator('iframe').locator('#field-text-22').click();
    await page.locator('.w-fit > .relative > .p-2').first().click();

    // Save sequence
    await page
        .locator('div')
        .filter({ hasText: /^Speichern$/ })
        .nth(2)
        .click();
    await page.waitForURL('/overview');

    // Todo: somehow check if sequence was saved and has H5P Content
});
