import { mount } from '@vue/test-utils';
import ButtonComponent from '../../frontend/src/components/ButtonComponent.vue';
import InteractableComponent from '../../frontend/src/components/InteractableComponent.vue';
import { describe, test } from 'vitest';

describe('tests', () => {
    test('Displays message inside ContainerComponent', async () => {
        const wrapper = mount(ButtonComponent, {
            slots: {
                default: 'Main Content',
            },
        });

        expect(wrapper.text()).toBe('Main Content');

        await wrapper.getComponent(InteractableComponent).trigger('click');

        expect(wrapper.emitted()).toHaveProperty('click');
    });
});
