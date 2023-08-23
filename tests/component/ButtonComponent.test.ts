import { mount } from '@vue/test-utils';
import ButtonComponent from '../../frontend/src/components/ButtonComponent.vue';
import InteractableComponent from '../../frontend/src/components/InteractableComponent.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { describe, test } from 'vitest';

describe('ButtonComponent', () => {
    test('Display text insice ButtonComponent', async () => {
        const wrapper = mount(ButtonComponent, {
            slots: {
                default: 'Button Content',
            },
        });

        expect(wrapper.text()).toBe('Button Content');
    });

    test('Click Button emit', async () => {
        const wrapper = mount(ButtonComponent, {
            slots: {
                default: 'Button Content',
            },
        });

        await wrapper.findComponent(InteractableComponent).trigger('click');

        expect(wrapper.emitted()).toHaveProperty('click');
    });

    test('Disable & Spinner prop', async () => {
        const wrapper = mount(ButtonComponent, {
            slots: {
                default: 'Button Content',
            },
        });

        expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(false);

        await wrapper.setProps({ loading: true });

        expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(true);
    });
});
