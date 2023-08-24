import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi, beforeEach } from 'vitest';
import { defineComponent } from 'vue';
import { SequenceRestInterface } from '../../frontend/src/restInterfaces/SequenceRestInterface';
import SequenceEditView from '../../frontend/src/views/SequenceEditView.vue';
import { LayoutSlot, LayoutType } from '../../model/slide/layout/Layout';
import { ContentType } from '../../model/slide/content/Content';

const wrapperOptions = {
    props: {
        sequenceCode: 'ABCDEF',
    },
    global: {
        stubs: {
            SlideOverviewContainer: true,
            SlideOptionsTab: true,
            LayoutOptionsTab: true,
            EmbedOptionsTab: true,
            ImageOptionsTab: true,
            TextOptionsTab: true,
            SlideDisplayFactory: true,
        },
    },
};

describe('SequenceEditView', () => {
    const getSequence = vi.spyOn(SequenceRestInterface, 'getSequence');
    beforeEach(() => {
        getSequence.mockResolvedValueOnce({
            authorId: -1,
            code: 'ABCDEF',
            creationDate: new Date(),
            modificationDate: new Date(),
            name: 'Episode IV - A New Hope',
            readAccess: [],
            slideCount: 0,
            slides: [],
            tags: [],
            writeAccess: [],
        });
    });

    const SuspenseSequenceEditView = defineComponent({
        components: { SequenceEditView },
        props: ['sequenceCode'],
        template:
            '<Suspense><SequenceEditView :sequenceCode="sequenceCode"/></Suspense>',
    });

    test('Display sequence correctly', async () => {
        const wrapper = mount(SuspenseSequenceEditView, wrapperOptions);
        await flushPromises();

        const sequence = wrapper.findComponent(SequenceEditView).vm.sequence;

        expect(getSequence).toBeCalledTimes(1);
        expect(getSequence).toBeCalledWith('ABCDEF');
        expect(
            wrapper
                .findComponent({ name: 'SlideOverviewContainer' })
                .props('slides')
        ).toEqual(sequence.slides);
        expect(
            wrapper
                .findComponent({ name: 'SlideOverviewContainer' })
                .props('selectedSlideIndex')
        ).toBe(0);
        expect(
            wrapper
                .findComponent({ name: 'TabbedContainer' })
                .props('shownTabs')
        ).toEqual(['slide', 'content.layout']);
        expect(
            wrapper
                .findComponent({ name: 'TabbedContainer' })
                .props('possibleTabs')
        ).toEqual([
            'slide',
            'content.layout',
            'content.text',
            'content.image',
            'content.embed',
        ]);
        expect(
            wrapper.findComponent({ name: 'SlideOptionsTab' }).props('slide')
        ).toEqual(sequence.slides[0]);
        expect(
            wrapper.findComponent({ name: 'SlideOptionsTab' }).props('sequence')
        ).toEqual(sequence);
        expect(
            wrapper.findComponent({ name: 'LayoutOptionsTab' }).props('slide')
        ).toEqual(sequence.slides[0]);
        expect(
            wrapper
                .findComponent({ name: 'SlideDisplayFactory' })
                .props('slide')
        ).toEqual(sequence.slides[0]);
    });

    test('Add new slide', async () => {
        const wrapper = mount(SuspenseSequenceEditView, wrapperOptions);
        await flushPromises();

        wrapper
            .findComponent({ name: 'SlideOverviewContainer' })
            .vm.$emit('addSlide');
        await flushPromises();

        const sequence = wrapper.findComponent(SequenceEditView).vm.sequence;
        expect(sequence.slides.length).toBe(2);
        expect(sequence.slides[1]).toEqual({
            layout: LayoutType.SINGLE_COLUMN_WITH_HEADER,
            content: {
                [LayoutSlot.HEADER]: {
                    contentType: ContentType.TEXT,
                    delta: { ops: [] },
                },
            },
            backgroundColor: '#ffffff',
            sequenceCode: 'ABCDEF',
            order: 1,
            id: 1,
        });
    });

    test('Reorder slides', async () => {
        const wrapper = mount(SuspenseSequenceEditView, wrapperOptions);
        await flushPromises();

        wrapper
            .findComponent({ name: 'SlideOverviewContainer' })
            .vm.$emit('addSlide');
        const sequence = wrapper.findComponent(SequenceEditView).vm.sequence;
        sequence.slides.reverse();
        wrapper
            .findComponent({ name: 'SlideOverviewContainer' })
            .vm.$emit('orderChanged');

        expect(sequence.slides[0].order).toBe(0);
        expect(sequence.slides[1].order).toBe(1);
    });

    test('Select new slide', async () => {
        const wrapper = mount(SuspenseSequenceEditView, {
            props: {
                sequenceCode: 'ABCDEF',
            },
            global: {
                stubs: {
                    SlideOverviewContainer: true,
                    SlideOptionsTab: true,
                    LayoutOptionsTab: true,
                    EmbedOptionsTab: true,
                    ImageOptionsTab: true,
                    TextOptionsTab: true,
                    SlideDisplayFactory: true,
                },
            },
        });
        await flushPromises();

        wrapper
            .findComponent({ name: 'SlideOverviewContainer' })
            .vm.$emit('addSlide');
        wrapper
            .findComponent({ name: 'SlideOverviewContainer' })
            .vm.$emit('selectionChanged', 1);
        await flushPromises();

        const sequence = wrapper.findComponent(SequenceEditView).vm.sequence;

        expect(
            wrapper
                .findComponent({ name: 'SlideOverviewContainer' })
                .props('selectedSlideIndex')
        ).toBe(1);
        expect(
            wrapper.findComponent({ name: 'SlideOptionsTab' }).props('slide')
        ).toEqual(sequence.slides[1]);
        expect(
            wrapper.findComponent({ name: 'LayoutOptionsTab' }).props('slide')
        ).toEqual(sequence.slides[1]);
        expect(
            wrapper
                .findComponent({ name: 'SlideDisplayFactory' })
                .props('slide')
        ).toEqual(sequence.slides[1]);
    });

    test('Delete slide', async () => {
        const wrapper = mount(SuspenseSequenceEditView, wrapperOptions);
        await flushPromises();

        wrapper
            .findComponent({ name: 'SlideOverviewContainer' })
            .vm.$emit('addSlide');
        wrapper
            .findComponent({ name: 'SlideOverviewContainer' })
            .vm.$emit('deleteSlide', 0);
        await flushPromises();

        const sequence = wrapper.findComponent(SequenceEditView).vm.sequence;

        expect(sequence.slides.length).toBe(1);
        expect(sequence.slides[0]).toEqual({
            layout: LayoutType.SINGLE_COLUMN_WITH_HEADER,
            content: {
                [LayoutSlot.HEADER]: {
                    contentType: ContentType.TEXT,
                    delta: { ops: [] },
                },
            },
            backgroundColor: '#ffffff',
            sequenceCode: 'ABCDEF',
            order: 1,
            id: 1,
        });
    });

    test('Change sequence title and layout', async () => {
        const wrapper = mount(SuspenseSequenceEditView, wrapperOptions);
        await flushPromises();

        wrapper
            .findComponent({ name: 'SlideOptionsTab' })
            .vm.$emit('updateSequence', {
                name: 'Episode V - The Empire Strikes Back',
            });
        const currentSlide =
            wrapper.findComponent(SequenceEditView).vm.sequence.slides[0];
        currentSlide.layout = LayoutType.GRID;
        wrapper
            .findComponent({ name: 'LayoutOptionsTab' })
            .vm.$emit('updateSlide', currentSlide);
        await flushPromises();

        const sequence = wrapper.findComponent(SequenceEditView).vm.sequence;
        expect(sequence.name).toBe('Episode V - The Empire Strikes Back');
        expect(sequence.slides[0].layout).toBe(LayoutType.GRID);
    });

    test('Change content type', async () => {
        const wrapper = mount(SuspenseSequenceEditView, wrapperOptions);
        await flushPromises();

        wrapper
            .findComponent({ name: 'SlideDisplayFactory' })
            .vm.$emit('changeContent', {
                slot: LayoutSlot.MAIN,
                type: ContentType.TEXT,
            });
        await flushPromises();

        const sequence = wrapper.findComponent(SequenceEditView).vm.sequence;
        expect(sequence.slides[0].content[LayoutSlot.MAIN].contentType).toBe(
            ContentType.TEXT
        );
    });

    test('Edit content', async () => {
        const wrapper = mount(SuspenseSequenceEditView, wrapperOptions);
        await flushPromises();

        wrapper
            .findComponent({ name: 'SlideDisplayFactory' })
            .vm.$emit('editing', {
                slot: LayoutSlot.HEADER,
                emit: { ops: [{ insert: 'New line\n' }] },
            });
        await flushPromises();

        expect(
            wrapper
                .findComponent({ name: 'TabbedContainer' })
                .props('shownTabs')
        ).toEqual(['slide', 'content.layout', 'content.text']);
        const sequence = wrapper.findComponent(SequenceEditView).vm.sequence;
        expect(sequence.slides[0].content[LayoutSlot.HEADER].delta).toEqual({
            ops: [{ insert: 'New line\n' }],
        });
    });

    test('Save sequence', async () => {
        const updateSequence = vi.spyOn(
            SequenceRestInterface,
            'updateSequence'
        );
        updateSequence.mockResolvedValue(undefined);

        const wrapper = mount(SuspenseSequenceEditView, wrapperOptions);
        await flushPromises();

        wrapper
            .findComponent({ name: 'SlideDisplayFactory' })
            .vm.$emit('changeContent', {
                slot: LayoutSlot.MAIN,
                type: ContentType.H5P,
            });
        wrapper
            .findComponent({ name: 'SlideDisplayFactory' })
            .vm.$emit('editing', {
                slot: LayoutSlot.HEADER,
                emit: { ops: [{ insert: 'New line\n' }] },
            });
        await wrapper
            .findComponent({ name: 'ButtonComponent' })
            .vm.$emit('click');
        await flushPromises();

        const sequence = wrapper.findComponent(SequenceEditView).vm.sequence;
        expect(updateSequence).toBeCalledTimes(1);
        expect(updateSequence).toBeCalledWith({
            authorId: -1,
            code: 'ABCDEF',
            creationDate: sequence.creationDate,
            modificationDate: sequence.modificationDate,
            name: 'Episode IV - A New Hope',
            readAccess: [],
            slideCount: 1,
            slides: [
                {
                    layout: LayoutType.SINGLE_COLUMN_WITH_HEADER,
                    content: {
                        [LayoutSlot.HEADER]: {
                            contentType: ContentType.TEXT,
                            delta: { ops: [{ insert: 'New line\n' }] },
                        },
                        [LayoutSlot.MAIN]: {
                            contentType: ContentType.H5P,
                            h5pContentId: 'new',
                        },
                    },
                    backgroundColor: '#ffffff',
                    sequenceCode: 'ABCDEF',
                    order: 0,
                    id: 0,
                },
            ],
            tags: [],
            writeAccess: [],
        });
    });
});
