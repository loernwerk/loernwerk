import NavigationBarItem from '../../../frontend/src/components/navBar/NavigationBarItem.vue';
import { mount } from '@vue/test-utils';

describe('NavigationBarItem', () => {
    test('bold when active', () => {
        const wrapper = mount(NavigationBarItem, {
            props: { active: true },
            global: {
                stubs: {
                    RouterLink: true,
                },
            },
        });
        expect(wrapper.get('div').classes()).toContain('font-bold');
    });

    test('not bold when not active', () => {
        const wrapper = mount(NavigationBarItem, {
            props: { active: false },
            global: {
                stubs: {
                    RouterLink: true,
                },
            },
        });
        expect(wrapper.get('div').classes()).not.toContain('font-bold');
    });

    test('router to correct path', async () => {
        const wrapper = mount(NavigationBarItem, {
            props: { targetLink: '/test' },
            global: {
                stubs: {
                    RouterLink: true,
                },
            },
        });

        expect(wrapper.get('router-link-stub').html()).toContain('to="/test"');
    });
});
