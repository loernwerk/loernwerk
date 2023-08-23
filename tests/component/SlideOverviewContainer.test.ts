import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import SlideOverviewContainer from '../../frontend/src/components/SlideOverviewContainer.vue';
import { LayoutType } from '../../model/slide/layout/Layout';
import ButtonComponent from '../../frontend/src/components/ButtonComponent.vue';
import { ISlide } from '../../model/slide/ISlide';
import { ConfigRestInterface } from '../../frontend/src/restInterfaces/ConfigRestInterface';
import { defineComponent } from 'vue';
describe('SlideOverviewContainer', () => {
    const slide1 = {
        layout: LayoutType.TITLEPAGE,
        content: {},
        backgroundColor: '#00FF00',
        sequenceCode: 'ABCDEF',
        order: 0,
        id: 1111,
    };

    const slide2 = {
        layout: LayoutType.TWO_COLUMN,
        content: {},
        backgroundColor: '#00FF00',
        sequenceCode: 'ABCDEF',
        order: 1,
        id: 2222,
    };

    vi.spyOn(ConfigRestInterface, 'getValue').mockResolvedValueOnce(-1);

    const SuspenseSlideOverviewContainer = defineComponent({
        components: { SlideOverviewContainer },
        props: ['slides', 'selectedSlideIndex'],
        emits: ['addSlide', 'deleteSlide', 'selectionChanged'],
        template:
            '<Suspense><SlideOverviewContainer :slides="slides" :selectedSlideIndex="selectedSlideIndex" ' +
            '@addSlide="$emit(\'addSlide\')" ' +
            '@delete="$emit(\'deleteSlide\')" ' +
            '@selectionChanged="$emit(\'selectionChanged\')"/></Suspense>',
    });

    const wrapper = mount(SuspenseSlideOverviewContainer, {
        props: {
            slides: [slide1 as ISlide, slide2 as ISlide],
            selectedSlideIndex: 0,
        },
    });

    test('Add slide', async () => {
        await wrapper.findComponent(ButtonComponent).vm.$emit('click');
        await flushPromises();
        expect(wrapper.emitted('addSlide')).toBeTruthy();
    });

    test('Delete Slide', async () => {
        const element = wrapper.findComponent(SuspenseSlideOverviewContainer);
        await wrapper.vm.$emit('deleteSlide');
        await flushPromises();
        expect(element.emitted('deleteSlide')).toBeTruthy();
    });

    test('Change Selection', async () => {
        const element = wrapper.findComponent(SuspenseSlideOverviewContainer);
        await wrapper.vm.$emit('selectionChanged');
        await flushPromises();
        expect(element.emitted('selectionChanged')).toBeTruthy();
    });
});
