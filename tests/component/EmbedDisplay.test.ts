import { mount } from '@vue/test-utils';
import { describe, test } from 'vitest';
import EmbedDisplay from '../../frontend/src/components/contentDisplay/EmbedDisplay.vue';
import { ContentType } from '../../model/slide/content/Content';

describe('EmbedDisplay', () => {
    test('Correct url in iframe', async () => {
        const wrapper = mount(EmbedDisplay, {
            props: {
                editMode: true,
                embedContent: {
                    contentType: ContentType.EMBED,
                    url: 'https://www.youtube.com/embed/dsHyUgGMht0',
                },
            },
        });

        expect(wrapper.find('iframe').attributes('src')).toBe(
            'https://www.youtube.com/embed/dsHyUgGMht0'
        );
    });

    test('Click on embed to signalize editing', async () => {
        const wrapper = mount(EmbedDisplay, {
            props: {
                editMode: true,
                embedContent: {
                    contentType: ContentType.EMBED,
                    url: 'https://www.youtube.com/embed/dsHyUgGMht0',
                },
            },
        });

        wrapper.find('div').trigger('click');

        expect(wrapper.emitted()).toHaveProperty('editing');
    });

    test('Click on embed not allowed to edit', async () => {
        const wrapper = mount(EmbedDisplay, {
            props: {
                editMode: false,
                embedContent: {
                    contentType: ContentType.EMBED,
                    url: 'https://www.youtube.com/embed/dsHyUgGMht0',
                },
            },
        });

        wrapper.find('div').trigger('click');

        expect(wrapper.emitted()).not.toHaveProperty('editing');
    });
});
