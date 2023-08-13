import { mount } from '@vue/test-utils';
import { describe, test } from 'vitest';
import ImageDisplay from '../../frontend/src/components/contentDisplay/ImageDisplay.vue';
import { ContentType } from '../../model/slide/content/Content';

describe('ImageDisplay', () => {
    test('Correct image.img in img', async () => {
        const wrapper = mount(ImageDisplay, {
            props: {
                editMode: true,
                imageContent: {
                    contentType: ContentType.IMAGE,
                    img: 'dasIstEinBildAlsBase64String',
                    scale: 1,
                },
            },
        });

        expect(wrapper.find('img').attributes('src')).toBe(
            'dasIstEinBildAlsBase64String'
        );
    });

    test('Correct scale in img', async () => {
        const wrapper = mount(ImageDisplay, {
            props: {
                editMode: true,
                imageContent: {
                    contentType: ContentType.IMAGE,
                    img: 'dasIstEinBildAlsBase64String',
                    scale: 0.5,
                },
            },
        });

        expect(wrapper.find('img').attributes('style')).toBe(
            'max-height: 50%; max-width: 50%;'
        );
    });

    test('Click on image to signalize editing', async () => {
        const wrapper = mount(ImageDisplay, {
            props: {
                editMode: true,
                imageContent: {
                    contentType: ContentType.IMAGE,
                    img: 'dasIstEinBildAlsBase64String',
                    scale: 1,
                },
            },
        });

        wrapper.find('div').trigger('click');

        expect(wrapper.emitted()).toHaveProperty('editing');
    });
});
