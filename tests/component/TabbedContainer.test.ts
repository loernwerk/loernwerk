import TabbedContianer from '../../frontend/src/components/TabbedContainer.vue';
import { mount } from '@vue/test-utils';

describe('TabbedContainer', () => {
    test('All tabs displayed', async () => {
        const wrapper = mount(TabbedContianer, {
            props: {
                possibleTabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                shownTabs: ['Tab 1', 'Tab 2', 'Tab 3'],
            },
        });

        expect(wrapper.text()).toContain('Tab 1');
        expect(wrapper.text()).toContain('Tab 2');
        expect(wrapper.text()).toContain('Tab 3');
    });

    test('Only shown tabs displayed', async () => {
        const wrapper = mount(TabbedContianer, {
            props: {
                possibleTabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                shownTabs: ['Tab 1', 'Tab 3'],
            },
        });

        expect(wrapper.text()).toContain('Tab 1');
        expect(wrapper.text()).not.toContain('Tab 2');
        expect(wrapper.text()).toContain('Tab 3');
    });

    test('Content changes on click', async () => {
        const wrapper = mount(TabbedContianer, {
            props: {
                possibleTabs: ['Tab 1', 'Tab 2'],
                shownTabs: ['Tab 1', 'Tab 2'],
            },
            slots: {
                'Tab 1': '<div id="tab1">Content 1</div>',
                'Tab 2': '<div id="tab2">Content 2</div>',
            },
        });

        expect(wrapper.text()).toContain('Content 1');
        expect(wrapper.get('#tab1').isVisible()).toBe(true);
        expect(wrapper.get('#tab2').isVisible()).toBe(false);

        const node = findNodeByText(wrapper, 'h1', 'Tab 2');
        if (!node) {
            fail('Could not find Tab selector');
        }
        await node.trigger('click');

        expect(wrapper.text()).toContain('Content 2');
        expect(wrapper.get('#tab1').isVisible()).toBe(false);
        expect(wrapper.get('#tab2').isVisible()).toBe(true);
    });
});
