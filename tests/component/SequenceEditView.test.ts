import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import { defineComponent } from 'vue';
import { SequenceRestInterface } from '../../frontend/src/restInterfaces/SequenceRestInterface';
import SequenceEditView from '../../frontend/src/views/SequenceEditView.vue';
// import { LayoutSlot, LayoutType } from '../../model/slide/layout/Layout';

// import { ContentType } from '../../model/slide/content/Content';

describe('SequenceEditView', () => {
    const SuspenseSequenceEditView = defineComponent({
        components: { SequenceEditView },
        props: ['sequenceCode'],
        template:
            '<Suspense><SequenceEditView :sequenceCode="sequenceCode"/></Suspense>',
    });

    test('Display sequence correctly', async () => {
        const getSequence = vi.spyOn(SequenceRestInterface, 'getSequence');
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
});
