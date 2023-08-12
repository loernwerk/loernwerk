import { config } from '@vue/test-utils';
import { vi } from 'vitest';

config.global.mocks = {
    // Mock translation function that just returns the translation key
    $t: (tKey: string): string => tKey
};

export const i18n_mock = vi.fn().mockImplementation((tKey: string, arg: string) => tKey + arg);