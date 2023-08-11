import { flushPromises, mount } from '@vue/test-utils';
import SlideOptionsTab from '../../frontend/src/components/sequenceEditOptionsTab/SlideOptionsTab.vue';
import TextInputComponent from '../../frontend/src/components/TextInputComponent.vue';

describe('SlideOptionsTab', () => {
    test('correctly display value', () => {
        const wrapper = mount(SlideOptionsTab, {
            props: {
                sequence: {
                    name: "test",
                },
                slide: {
                    name: "test",
                },
                disableButton: false,
            }
        })
        expect(wrapper.getComponent(TextInputComponent).html()).toContain('test');
    });

    test('emit on Button click', async () => {
        const wrapper = mount(SlideOptionsTab, {
            props: {
                sequence: {
                    name: "test",
                },
                slide: {
                    name: "test",
                },
                disableButton: false,
            }
        });
        wrapper.get('input').setValue('test2');
        await flushPromises();
        expect(wrapper.emitted()).toHaveProperty('update-sequence');
    })
});