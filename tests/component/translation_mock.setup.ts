import { config } from '@vue/test-utils';
import { vi } from 'vitest';

export const i18nMock = vi.fn().mockImplementation((tKey: string) => tKey);

config.global.mocks = {
    // Mock translation function that just returns the translation key
    $t: i18nMock,
};
