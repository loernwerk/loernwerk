import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, beforeEach, vi } from 'vitest';
import H5PDisplay from '../../frontend/src/components/contentDisplay/H5PDisplay.vue';
import { ContentType } from '../../model/slide/content/Content';
import { defineComponent } from 'vue';
import { H5PRestInterface } from '../../frontend/src/restInterfaces/H5PRestInterface';

describe('H5PDisplay', () => {
    const SuspenseH5PDisplay = defineComponent({
        components: { H5PDisplay },
        props: ['h5pContent', 'editMode'],
        emits: ['editing'],
        template:
            '<Suspense><H5PDisplay :h5pContent="h5pContent" :editMode="editMode" @editing="(val) => $emit(\'editing\', val)" /></Suspense>',
    });

    beforeEach(() => {
        vi.spyOn(H5PRestInterface, 'getH5PContentList').mockResolvedValueOnce(
            []
        );
    });

    test('Correctly display H5PPlayer', async () => {
        const wrapper = mount(SuspenseH5PDisplay, {
            global: {
                stubs: {
                    H5PEditor: true,
                    H5PPlayer: true,
                },
            },
            props: {
                editMode: false,
                h5pContent: {
                    h5pContentId: '2',
                    contentType: ContentType.H5P,
                },
            },
        });
        await flushPromises();

        expect(
            wrapper.getComponent({ name: 'H5PPlayer' }).props('contentId')
        ).toBe('2');
    });

    test('Correctly display editor cover', async () => {
        const wrapper = mount(SuspenseH5PDisplay, {
            global: {
                stubs: {
                    H5PEditor: true,
                    H5PPlayer: true,
                },
            },
            props: {
                editMode: true,
                h5pContent: {
                    h5pContentId: '2',
                    contentType: ContentType.H5P,
                },
            },
        });
        await flushPromises();

        expect(wrapper.text()).toContain('h5p.clickToEdit');
    });

    test('Correctly display H5PEditor', async () => {
        const wrapper = mount(SuspenseH5PDisplay, {
            global: {
                stubs: {
                    H5PPlayer: true,
                    H5PEditor: true,
                },
            },
            props: {
                editMode: true,
                h5pContent: {
                    h5pContentId: '2',
                    contentType: ContentType.H5P,
                },
            },
        });
        await flushPromises();

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
        const wrapper = mount(SuspenseH5PDisplay, {
            global: {
                stubs: {
                    H5PPlayer: true,
                    H5PEditor: true,
                },
            },
            props: {
                editMode: true,
                h5pContent: {
                    h5pContentId: '2',
                    contentType: ContentType.H5P,
                },
            },
        });
        await flushPromises();

        await wrapper
            .find('div.h-full.cursor-pointer.flex.p-5.w-full')
            .trigger('click');
        wrapper
            .findComponent({ name: 'H5PEditor' })
            .vm.$emit('closed', 'someID');
        await flushPromises();

        expect(wrapper.text()).toContain('h5p.clickToEdit');
        const editingEmit = wrapper.emitted('editing') as string[][];
        expect(editingEmit.length).toBe(2);
        expect(editingEmit[1]).toEqual(['someID']);
    });
});
