import { mount } from '@vue/test-utils';
import SlideOverviewContainerElement from '../../frontend/src/components/SlideOverviewContainerElement.vue';

describe('SlideOverviewContainerElement', () => {
    test('Delete button emits delete event', async () => {
        const wrapper = mount(SlideOverviewContainerElement, {
            props: { slide: { id: 1, title: 'Test', content: 'Test' } },
        });

        await wrapper.get('svg').trigger('click');

        const deleteEmit = wrapper.emitted('delete') as number[][];
        expect(deleteEmit.length).toBe(1);
    });

    test('Click event emits click event', async () => {
        const wrapper = mount(SlideOverviewContainerElement, {
            props: { slide: { id: 1, title: 'Test', content: 'Test' } },
        });

        await wrapper.get('.aspect-video').trigger('click');

        const clickEmit = wrapper.emitted('click') as number[][];
        expect(clickEmit.length).toBe(1);
    });
});
