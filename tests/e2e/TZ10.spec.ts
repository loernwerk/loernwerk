import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://main.loernwerk.de/BDECFA');

    expect(page.locator('//*[@id="editor"]/div[1]/p/span').getText()).toEqual(
        'Herzlich Wilkommen zur Loernwerk-Demo'
    );
});
