import NavigationBarItem from '../../frontend/src/components/navBar/NavigationBarItem.vue';
import { RouterLinkStub, mount, shallowMount } from '@vue/test-utils';

describe('NavigationBarItem', () => {
    test('bold when active', () => {
        const wrapper = mount(NavigationBarItem, {
            props: { active: true },
        });
        expect(wrapper.get('div').classes()).toContain('font-bold');
    });

    test('not bold when not active', () => {
        const wrapper = mount(NavigationBarItem, {
            props: { active: false },
        });
        expect(wrapper.get('div').classes()).not.toContain('font-bold');
    });

    test('router to correct path', async () => {
        const wrapper = shallowMount(NavigationBarItem, {
            props: { targetLink: '/test' },
            stubs: {
                RouterLink: RouterLinkStub,
            },
        });

        console.log(wrapper.get('router-link').html());
        expect(wrapper.get('router-link').html()).toContain('to="/test"');
    });
});
