import { wrap } from "module";
import { mount } from "@vue/test-utils";
import DeleteSequencePopupTab from "../../frontend/src/components/sequenceOverviewPopUpTabs/DeleteSequencePopupTab.vue";
import InteractableComponent from '../../frontend/src/components/InteractableComponent.vue';

describe('DeleteSequencePopupTab', () => {
    test('correctly display value', () => {
        const wrapper = mount(DeleteSequencePopupTab, {
            props: {
                sequence: {
                    name: "test",
                }
            }
        })

        console.log(wrapper.get('h1'))

        expect(wrapper.get('h1').text()).toContain('test'); //i18n
    });

    test('emit on Button click', () => {
        const wrapper = mount(DeleteSequencePopupTab, {
            props: {
                sequence: {
                    name: "test",
                }
            }
        });

        wrapper.get(InteractableComponent).trigger('click');
        expect(wrapper.emitted('delete')).toBeTruthy();
    })
});