import NavigationBar from '../../frontend/src/components/navBar/NavigationBar.vue';
import { mount } from '@vue/test-utils';

describe('NavigationBar', () => {
    test('dummy', () => {
        const wrapper = mount(NavigationBar);
        expect(true).toBeTruthy();
    });
});