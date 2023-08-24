import { test, expect } from '@playwright/test';
import { ISequence } from '../../model/sequence/ISequence';
import axios from 'axios';

test('test', async ({ page, context }) => {
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

    // Locate ... on Sequence
    await page
        .locator(
            'div:nth-child(4) > div > div > div:nth-child(2) > div > .space-y-2 > div:nth-child(3) > div:nth-child(2) > .relative > .p-2'
        )
        .click();
    await page.getByPlaceholder('Schlüsselwörter').click();
    await page.getByPlaceholder('Schlüsselwörter').fill('Tag123');
    await page
        .locator('div')
        .filter({ hasText: /^Speichern$/ })
        .nth(3)
        .click();

    // Expect tag to be on sequence
    expect(page.getByText('Tag123')).toBeDefined();
    const loernwerkCookie = (await context.cookies()).find(
        (cookie) => cookie.name === 'loernwerk.session'
    )?.value as string;
    let sequences = await fetch('http://localhost:5000/api/sequence/list', {
        headers: { cookie: 'loernwerk.session=' + loernwerkCookie },
    });
    expect(sequences.status).toBe(200);
    let sequencesJson = (await sequences.json()) as ISequence[];
    expect(sequencesJson.some((value) => value.tags.includes('Tag123'))).toBe(
        true
    );

    // Search for tag and remove it
    const searchBar = page.getByPlaceholder('Suche...');
    await searchBar.click();
    await searchBar.fill('Tag123');
    await page.locator('div:nth-child(2) > .relative > .p-2').click();
    await page.getByPlaceholder('Schlüsselwörter').click();
    await page.getByPlaceholder('Schlüsselwörter').fill('');
    await page
        .locator('div')
        .filter({ hasText: /^Speichern$/ })
        .nth(3)
        .click();
    await searchBar.click();
    await searchBar.fill('');

    // Expect tag to be removed from sequence
    expect(await page.innerHTML('body')).not.toContain('Tag123');
    sequences = await axios.get('http://localhost:5000/api/sequence/list', {
        headers: { cookie: 'loernwerk.session=' + loernwerkCookie },
    });
    expect(sequences.status).toBe(200);
    sequencesJson = sequences.data as ISequence[];
    expect(sequencesJson.some((value) => value.tags.includes('Tag123'))).toBe(
        false
    );
});
