import TextOptionsTab from '../../../frontend/src/components/sequenceEditOptionsTab/TextOptionsTab.vue';
import QuillToolBarVue from '../../../frontend/src/components/sequenceEditOptionsTab/QuillToolBar.vue';
import { mount } from '@vue/test-utils';
import { LayoutSlot } from '../../../model/slide/layout/Layout';

describe('TextOptionsTab', () => {
    test('All Toolbars mounted', async () => {
        const wrapper = mount(TextOptionsTab, {
            props: {
                selectedSlot: LayoutSlot.HEADER,
            },
        });

        expect(wrapper.findAllComponents(QuillToolBarVue).length).toBe(
            Object.keys(LayoutSlot).length
        );
    });

    test('All Toolbars have correct ids', async () => {
        const wrapper = mount(TextOptionsTab, {
            props: {
                selectedSlot: LayoutSlot.HEADER,
            },
        });

        for (const slot of Object.keys(LayoutSlot)) {
            const toolbar = wrapper.find(`#q-toolbar-${slot}`);
            expect(toolbar.exists()).toBe(true);
        }
    });

    test('Only selected toolbar displayed', async () => {
        const wrapper = mount(TextOptionsTab, {
            props: {
                selectedSlot: LayoutSlot.HEADER,
            },
        });

        let visibleToolbars = 0;
        let invisibleToolbars = 0;
        for (const slot of Object.keys(LayoutSlot)) {
            if (wrapper.get(`#q-toolbar-${slot}`).isVisible()) {
                visibleToolbars++;
            } else {
                invisibleToolbars++;
            }
        }

        expect(visibleToolbars + invisibleToolbars).toBe(
            Object.keys(LayoutSlot).length
        );
        expect(visibleToolbars).toBe(1);
        expect(invisibleToolbars).toBe(Object.keys(LayoutSlot).length - 1);
    });
});
