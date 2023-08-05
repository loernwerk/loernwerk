import { flushPromises, mount } from '@vue/test-utils';
import { describe, test } from 'vitest';
import H5PDisplay from '../../frontend/src/components/contentDisplay/H5PDisplay.vue';
import { ContentType } from '../../model/slide/content/Content';

describe('H5PDisplay', () => {
    test('Correctly display H5PPlayer', () => {
        const wrapper = mount(H5PDisplay, {
            global: {
                stubs: {
                    H5PPlayer: true,
                },
            },
            props: {
                editMode: false,
                h5pContent: {
                    h5pContentId: '2',
                    contentType: ContentType.H5P,
                    sequenceCode: 'ABC123', // TODO: To be removed after merging PR
                },
            },
        });

        expect(
            wrapper.getComponent({ name: 'H5PPlayer' }).props('contentId')
        ).toBe('2');
    });

    test('Correctly display editor cover', () => {
        const wrapper = mount(H5PDisplay, {
            props: {
                editMode: true,
                h5pContent: {
                    h5pContentId: '2',
                    contentType: ContentType.H5P,
                    sequenceCode: 'ABC123', // TODO: To be removed after merging PR
                },
            },
        });

        expect(wrapper.text()).toContain('Klicke um den Inhalt zu bearbeiten');
    });

    test('Correctly display H5PEditor', async () => {
        const wrapper = mount(H5PDisplay, {
            global: {
                stubs: {
                    H5PEditor: true,
                },
            },
            props: {
                editMode: true,
                h5pContent: {
                    h5pContentId: '2',
                    contentType: ContentType.H5P,
                    sequenceCode: 'ABC123', // TODO: To be removed after merging PR
                },
            },
        });

        await wrapper
            .find('div.h-full.cursor-pointer.flex.p-5.w-full')
            .trigger('click');
        await flushPromises();

        expect(
            wrapper.getComponent({ name: 'H5PEditor' }).props('contentId')
        ).toBe('2');
        expect(wrapper.emitted()).toHaveProperty('editing');
    });

    test('Correctly closing H5PEditor', async () => {
        const wrapper = mount(H5PDisplay, {
            global: {
                stubs: {
                    H5PEditor: true,
                },
            },
            props: {
                editMode: true,
                h5pContent: {
                    h5pContentId: '2',
                    contentType: ContentType.H5P,
                    sequenceCode: 'ABC123', // TODO: To be removed after merging PR
                },
            },
        });

        await wrapper
            .find('div.h-full.cursor-pointer.flex.p-5.w-full')
            .trigger('click');
        wrapper
            .findComponent({ name: 'H5PEditor' })
            .vm.$emit('closed', 'someID');
        await flushPromises();

        expect(wrapper.text()).toContain('Klicke um den Inhalt zu bearbeiten');
        const editingEmit = wrapper.emitted('editing') as string[][];
        expect(editingEmit.length).toBe(2);
        expect(editingEmit[1]).toEqual(['someID']);
    });
});
