import { mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import LanguageSelector from '../../frontend/src/components/navBar/LanguageSelector.vue';
import { i18n } from '../../frontend/src/i18n';

vi.mock('../../frontend/src/i18n', () => {
    return {
        i18n: {
            global: {
                availableLocales: ['de', 'en'],
                locale: 'de',
            },
        },
    };
});

describe('LanguageSelector', () => {
    test('Display both language images', () => {
        const wrapper = mount(LanguageSelector, {
            global: {
                mocks: {
                    getIconUrl: (lang: string) =>
                        `../../assets/langs/${lang}.png`,
                },
            },
        });

        const images = wrapper.findAll('img');
        const imageUrls = [
            '../../assets/langs/de.png',
            '../../assets/langs/en.png',
        ];
        for (const imageIndex in images) {
            expect(images[imageIndex].attributes('src')).toBe(
                imageUrls[imageIndex]
            );
        }
        expect(wrapper.get('img.border-2').attributes('src')).toBe(
            imageUrls[0]
        );
    });

    test('Changing locale', () => {
        const wrapper = mount(LanguageSelector, {
            global: {
                mocks: {
                    getIconUrl: (lang: string) =>
                        `../../assets/langs/${lang}.png`,
                },
            },
        });

        expect(i18n.global.locale).toBe('de');
        wrapper.find('img[src="../../assets/langs/en.png"]').trigger('click');
        expect(i18n.global.locale).toBe('en');
    });

    test('Custom border color', () => {
        const wrapper = mount(LanguageSelector, {
            props: {
                borderColor: '#ffffff',
            },
            global: {
                mocks: {
                    getIconUrl: (lang: string) =>
                        `../../assets/langs/${lang}.png`,
                },
            },
        });

        const images = wrapper.findAll('img');
        for (const image of images) {
            expect(image.attributes('style')).toBe('border-color: #ffffff;');
        }
    });
});
