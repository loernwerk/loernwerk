import { mount } from '@vue/test-utils';
import { describe, test } from 'vitest';
import LayoutOptionsTab from '../../../frontend/src/components/sequenceEditOptionsTab/LayoutOptionsTab.vue';
import { LayoutType } from '../../../model/slide/layout/Layout';
import InteractableComponent from '../../../frontend/src/components/InteractableComponent.vue';

describe('LayoutOptionsTab', () => {
    const baseSlide = {
        layout: LayoutType.TITLEPAGE,
        content: {},
        backgroundColor: 'white',
        sequenceCode: 'CODE66',
        order: 1,
        id: 12345,
    };
    const wrapper = mount(LayoutOptionsTab, {
        props: {
            slide: {
                ...baseSlide,
            },
        },
    });

    test('Layouts are rendered and contain images', async () => {
        const layouts = wrapper.findAllComponents(InteractableComponent);
        expect(layouts.length).toBe(8);
        const preview = wrapper.find('img');
        expect(preview.exists()).toBeTruthy();
        let counter = 0;
        for (const layout of layouts) {
            await layout.trigger('click');
            expect(wrapper.emitted('update-slide')).toBeTruthy();
            expect(
                wrapper
                    .find(
                        `[src="${wrapper.vm.getLayoutImageUrl(
                            wrapper.vm.layoutImageMap[counter]
                        )}"`
                    )
                    .exists()
            ).toBeTruthy();
            counter++;
        }
    });
});
