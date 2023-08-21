import { mount } from '@vue/test-utils';
import { describe, test } from 'vitest';
import ContentDisplayFactory from '../../../frontend/src/components/contentDisplay/ContentDisplayFactory.vue';
import { ContentType } from '../../../model/slide/content/Content';
import EmbedDisplay from '../../../frontend/src/components/contentDisplay/EmbedDisplay.vue';
import Delta from 'quill-delta';
import TextDisplay from '../../../frontend/src/components/contentDisplay/TextDisplay.vue';
import ImageDisplay from '../../../frontend/src/components/contentDisplay/ImageDisplay.vue';
import H5PDisplay from '../../../frontend/src/components/contentDisplay/H5PDisplay.vue';
describe('SequenceDisplayPreview', () => {
    test('EmbedContent', async () => {
        const wrapper = mount(ContentDisplayFactory, {
            props: {
                content: {
                    url: 'someUrl',
                    contentType: ContentType.EMBED,
                },
                editMode: true,
                layoutSlot: 1,
            },
        });

        expect(wrapper.findComponent(EmbedDisplay).exists()).toBeTruthy();
        await wrapper.vm.$emit('editing');
        await wrapper.vm.$nextTick(() => {
            expect(wrapper.emitted('editing'));
            expect(wrapper.emitted().editing[1]).not.toBeNull();
        });
    });

    test('TextContent', async () => {
        const wrapper = mount(ContentDisplayFactory, {
            props: {
                content: {
                    delta: new Delta(),
                    contentType: ContentType.TEXT,
                },
                editMode: true,
                layoutSlot: 1,
            },
        });
        expect(wrapper.findComponent(TextDisplay).exists()).toBeTruthy();
    });

    test('ImageContent', async () => {
        const wrapper = mount(ContentDisplayFactory, {
            props: {
                content: {
                    img: {},
                    scale: 100,
                    contentType: ContentType.IMAGE,
                },
                editMode: true,
                layoutSlot: 1,
            },
        });
        expect(wrapper.findComponent(ImageDisplay).exists()).toBeTruthy();
    });

    test('H5PContent', async () => {
        const wrapper = mount(ContentDisplayFactory, {
            props: {
                content: {
                    h5pContentId: 1000,
                    sequenceCode: 'ABCDEF',
                    contentType: ContentType.H5P,
                },
                editMode: true,
                layoutSlot: 1,
            },
            global: {
                stubs: {
                    H5PDisplay: true,
                },
            },
        });
        expect(wrapper.findComponent(H5PDisplay).exists()).toBeTruthy();
    });
});
