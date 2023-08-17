import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import AccountCreationContainer from '../../../frontend/src/components/admin/AccountCreationContainer.vue';
import ButtonComponentVue from '../../../frontend/src/components/ButtonComponent.vue';
import { AccountRestInterface } from '../../../frontend/src/restInterfaces/AccountRestInterface';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
} from '../../../model/loernwerkError';

describe('AccountCreationContainer', () => {
    test('Creates new user with inputted details', async () => {
        const addAccount = vi.spyOn(AccountRestInterface, 'addAccount');
        addAccount.mockResolvedValueOnce(0);

        const wrapper = mount(AccountCreationContainer, {});

        const table = wrapper.find('table').findAll('input');
        const inputArray = ['a', 'a@x.de', '123456', '123456'];
        for (const index in table) {
            await table[index].setValue(inputArray[index]);
        }

        wrapper.getComponent(ButtonComponentVue).vm.$emit('click');
        await flushPromises();

        expect(addAccount).toHaveBeenCalledTimes(1);
        expect(addAccount).toBeCalledWith(
            {
                name: inputArray[0],
                mail: inputArray[1],
                password: inputArray[2],
            },
            undefined
        );
        expect(wrapper.emitted()).toHaveProperty('create');
    });

    test('Creates invalid user and show error', async () => {
        const addAccount = vi.spyOn(AccountRestInterface, 'addAccount');
        addAccount.mockImplementationOnce(() => {
            throw new LoernwerkError(
                'Invalid Input',
                LoernwerkErrorCodes.INVALID_PARAMETER
            );
        });

        const wrapper = mount(AccountCreationContainer, {});

        const table = wrapper.find('table').findAll('input');
        const inputArray = ['a', 'a@x.de', '12345', '12345'];
        for (const index in table) {
            await table[index].setValue(inputArray[index]);
        }

        wrapper.getComponent(ButtonComponentVue).vm.$emit('click');
        await flushPromises();

        expect(addAccount).toBeCalledTimes(1);
        expect(wrapper.html()).toContain('invalidInput');
    });

    test('Create user with unequal passwords', async () => {
        const wrapper = mount(AccountCreationContainer, {});
        const addAccount = vi.spyOn(AccountRestInterface, 'addAccount');

        const table = wrapper.find('table').findAll('input');
        const inputArray = ['a', 'a@x.de', '12345678', '87654321'];
        for (const index in table) {
            await table[index].setValue(inputArray[index]);
        }

        wrapper.getComponent(ButtonComponentVue).vm.$emit('click');
        await flushPromises();

        expect(addAccount).toHaveBeenCalledTimes(0);
        expect(wrapper.html()).toContain('text-error');
    });

    test('Create user with not accepted email format', async () => {
        const addAccount = vi.spyOn(AccountRestInterface, 'addAccount');
        const wrapper = mount(AccountCreationContainer, {});

        const table = wrapper.find('table').findAll('input');
        const inputArray = ['a', 'ax.de', '123456', '123456'];
        for (const index in table) {
            await table[index].setValue(inputArray[index]);
        }

        wrapper.getComponent(ButtonComponentVue).vm.$emit('click');
        await flushPromises();

        expect(addAccount).toHaveBeenCalledTimes(0);
        expect(wrapper.html()).toContain('text-error');
    });

    test('Prop requires invitecode', async () => {
        const addAccount = vi.spyOn(AccountRestInterface, 'addAccount');
        addAccount.mockResolvedValueOnce(0);

        const wrapper = mount(AccountCreationContainer, {
            props: {
                requiresInviteCode: true,
            },
        });

        const table = wrapper.find('table').findAll('input');
        expect(table.length).toBe(5);

        const inputArray = [
            'a',
            'a@x.de',
            '123456',
            '123456',
            'RegistrationCode',
        ];
        for (const index in table) {
            await table[index].setValue(inputArray[index]);
        }

        wrapper.getComponent(ButtonComponentVue).vm.$emit('click');
        await flushPromises();

        expect(addAccount).toHaveBeenCalledTimes(1);
        expect(addAccount).toBeCalledWith(
            {
                name: inputArray[0],
                mail: inputArray[1],
                password: inputArray[2],
            },
            inputArray[4]
        );
    });
});
