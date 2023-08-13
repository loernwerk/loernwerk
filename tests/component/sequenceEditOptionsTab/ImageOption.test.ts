import { flushPromises, mount } from '@vue/test-utils';
import { describe, test } from 'vitest';
import ImageOptionTab from '../../frontend/src/components/sequenceEditOptionsTab/ImageOptionsTab.vue';
import { ContentType } from '../../model/slide/content/Content';

describe('ImageOptionTab', () => {
    test('Correct selected scale', async () => {
        const wrapper = mount(ImageOptionTab, {
            props: {
                imageContent: {
                    contentType: ContentType.IMAGE,
                    img: 'pictureAsBase64String',
                    scale: 1,
                },
            },
        });

        wrapper.html().includes('100%');

        await wrapper.find('input').setValue(0.56);
        await flushPromises();

        expect(wrapper.emitted()).toHaveProperty('update-content');

        wrapper.html().includes('56%');
    });
});
