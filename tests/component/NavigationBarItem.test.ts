import NavigationBarItem from '../../frontend/src/components/navBar/NavigationBarItem.vue';
import { mount } from '@vue/test-utils';
import { routerMock } from './router_mock.setup';

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
        const wrapper = mount(NavigationBarItem, {
            props: { targetLink: '/test' },
        });

        await wrapper.get('router-link').trigger('click');
        expect(routerMock.push).toHaveBeenCalledTimes(1);
        expect(routerMock.push).toHaveBeenCalledWith('/test');
    });
});