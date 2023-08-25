import TabbedContianer from '../../frontend/src/components/TabbedContainer.vue';
import { DOMWrapper, mount } from '@vue/test-utils';
import { findNodeByText } from '../component/TestUtilities';
import { nextTick } from 'vue';

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
        expect(checkTabVisibility(wrapper.get('#tab1'))).toBe(true);
        expect(checkTabVisibility(wrapper.get('#tab2'))).toBe(false);

        const node = findNodeByText(wrapper, 'h1', 'Tab 2');
        if (!node) {
            fail('Could not find Tab selector');
        }
        await node.trigger('click');

        expect(wrapper.text()).toContain('Content 2');
        expect(checkTabVisibility(wrapper.get('#tab1'))).toBe(false);
        expect(checkTabVisibility(wrapper.get('#tab2'))).toBe(true);
    });

    test('selectTab function', async () => {
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
        expect(checkTabVisibility(wrapper.get('#tab1'))).toBe(true);
        expect(checkTabVisibility(wrapper.get('#tab2'))).toBe(false);

        wrapper.vm.selectTab('Tab 2');
        await nextTick();

        expect(wrapper.text()).toContain('Content 2');
        expect(checkTabVisibility(wrapper.get('#tab1'))).toBe(false);
        expect(checkTabVisibility(wrapper.get('#tab2'))).toBe(true);
    });

    test('removal of selected tab', async () => {
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
        expect(checkTabVisibility(wrapper.get('#tab1'))).toBe(true);
        expect(checkTabVisibility(wrapper.get('#tab2'))).toBe(false);

        wrapper.vm.selectTab('Tab 2');
        await nextTick();

        expect(wrapper.text()).toContain('Content 2');
        expect(checkTabVisibility(wrapper.get('#tab1'))).toBe(false);
        expect(checkTabVisibility(wrapper.get('#tab2'))).toBe(true);

        wrapper.setProps({ shownTabs: ['Tab 1'] });
        await nextTick();

        expect(wrapper.text()).toContain('Content 1');
        expect(checkTabVisibility(wrapper.get('#tab1'))).toBe(true);
        expect(checkTabVisibility(wrapper.get('#tab2'))).toBe(false);
    });
});

/**
 * Checks if a tab is visible by checking the display style of the tab is set to none
 * @param tabValue div inside tab as used in the tests
 * @returns True if the tab is visible, false otherwise
 */
function checkTabVisibility(
    tabValue: Omit<DOMWrapper<HTMLDivElement>, string>
): boolean {
    return tabValue.element?.parentElement?.style.display != 'none';
}
