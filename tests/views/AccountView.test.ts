import { defineComponent } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import AccountView from '../../frontend/src/views/AccountView.vue';
import { vi } from 'vitest';
import { AccountRestInterface } from '../../frontend/src/restInterfaces/AccountRestInterface';
import AccountDetailsEditContainerVue from '../../frontend/src/components/AccountDetailsEditContainer.vue';
import ButtonComponentVue from '../../frontend/src/components/ButtonComponent.vue';
import { findComponentByText } from '../component/TestUtilities';
import { routerMock } from '../component/router_mock.setup';

const wrapperView = defineComponent({
    components: { AccountView },
    template: '<Suspense><AccountView /></Suspense>',
});

describe('AccountView', () => {
    beforeAll(() => {
        vi.spyOn(AccountRestInterface, 'getOwnAccount').mockResolvedValue({
            id: 1,
            name: 'Luke Skywalker',
            mail: 'notTheLast@jedi.space',
        });
    });

    test('should render', async () => {
        const wrapper = mount(wrapperView);
        await flushPromises();

        expect(wrapper.findComponent(AccountView).exists()).toBe(true);
    });

    test('should render account data', async () => {
        const wrapper = mount(wrapperView);
        await flushPromises();

        expect(
            wrapper.findComponent(AccountDetailsEditContainerVue).exists()
        ).toBe(true);
        const expectedValues = [
            'Luke Skywalker',
            'notTheLast@jedi.space',
            '',
            '',
        ];
        expect(wrapper.findAll('input').length).toBe(expectedValues.length);

        for (const input of wrapper.findAll('input')) {
            expect(input.element.value).toBe(expectedValues.shift());
        }
    });

    test('send changed data', async () => {
        const save = vi
            .spyOn(AccountRestInterface, 'updateAccount')
            .mockResolvedValue();

        const wrapper = mount(wrapperView);
        await flushPromises();

        await wrapper.findAll('input')[0].setValue('Darth Vader');
        await wrapper.findAll('input')[1].setValue('aTrue@sith.space');

        findComponentByText(wrapper, ButtonComponentVue, 'save')?.vm.$emit(
            'click'
        );
        await flushPromises();

        expect(save).toHaveBeenCalled();
        expect(save).toHaveBeenCalledWith({
            id: 1,
            name: 'Darth Vader',
            mail: 'aTrue@sith.space',
        });
    });

    test('send changed password', async () => {
        const save = vi
            .spyOn(AccountRestInterface, 'updateAccount')
            .mockResolvedValue();

        const wrapper = mount(wrapperView);
        await flushPromises();

        await wrapper.findAll('input')[2].setValue('abc123');
        await wrapper.findAll('input')[3].setValue('abc123');

        findComponentByText(wrapper, ButtonComponentVue, 'save')?.vm.$emit(
            'click'
        );
        await flushPromises();

        expect(save).toHaveBeenCalled();
        expect(save).toHaveBeenCalledWith({
            id: 1,
            name: 'Luke Skywalker',
            mail: 'notTheLast@jedi.space',
            password: 'abc123',
        });
    });

    test('wrong password confirmation', async () => {
        const save = vi
            .spyOn(AccountRestInterface, 'updateAccount')
            .mockResolvedValue();

        const wrapper = mount(wrapperView);
        await flushPromises();

        await wrapper.findAll('input')[2].setValue('123456');
        await wrapper.findAll('input')[3].setValue('654321');

        findComponentByText(wrapper, ButtonComponentVue, 'save')?.vm.$emit(
            'click'
        );
        await flushPromises();

        expect(save).not.toHaveBeenCalled();
    });

    test('wrong email', async () => {
        const save = vi
            .spyOn(AccountRestInterface, 'updateAccount')
            .mockResolvedValue();

        const wrapper = mount(wrapperView);
        await flushPromises();

        await wrapper.findAll('input')[1].setValue('notAnEmail');

        findComponentByText(wrapper, ButtonComponentVue, 'save')?.vm.$emit(
            'click'
        );
        await flushPromises();

        expect(save).not.toHaveBeenCalled();
    });

    test('logout', async () => {
        vi.spyOn(AccountRestInterface, 'logout').mockResolvedValue();

        const wrapper = mount(wrapperView);
        await flushPromises();

        findComponentByText(wrapper, ButtonComponentVue, 'Logout')?.vm.$emit(
            'click'
        );
        await flushPromises();

        expect(AccountRestInterface.logout).toHaveBeenCalled();
        expect(routerMock.push).toHaveBeenCalled();
        expect(routerMock.push).toHaveBeenCalledWith({ name: 'LogIn' });
    });
});
