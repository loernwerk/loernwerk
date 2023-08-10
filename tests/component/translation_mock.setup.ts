import { config } from '@vue/test-utils';

config.global.mocks = {
    // Mock translation function that just returns the translation key
    $t: (tKey: string): string => tKey
};