import { describe, test, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import AccountDetailsEditContainer from '../../frontend/src/components/AccountDetailsEditContainer.vue';
import ButtonComponent from '../../frontend/src/components/ButtonComponent.vue';
import { UserClass } from '../../model/user/IUser';
import { AccountRestInterface } from '../../frontend/src/restInterfaces/AccountRestInterface';
import { findComponentByText } from './TestUtilities';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
} from '../../model/loernwerkError';

describe('AccountDetailsEditContainer', () => {
    test('Display given user values', () => {
        const wrapper = mount(AccountDetailsEditContainer, {
            props: {
                user: {
                    name: 'Han Solo',
                    mail: 'solo@loernwerk.de',
                    type: UserClass.ADMIN,
                    id: 1,
                },
            },
        });

        const inputs = wrapper.findAll('input');
        const expectedValues = ['Han Solo', 'solo@loernwerk.de', '', ''];
        for (const inputIndex in inputs) {
            expect(inputs[inputIndex].element.value).toBe(
                expectedValues[inputIndex]
            );
        }
    });

    test('Display isAdmin checkbox', () => {
        const wrapper = mount(AccountDetailsEditContainer, {
            props: {
                user: {
                    name: 'Han Solo',
                    mail: 'solo@loernwerk.de',
                    type: UserClass.ADMIN,
                    id: 1,
                },
                showadminview: true,
            },
        });

        const inputs = wrapper.findAll('input');
        const expectedValues = ['Han Solo', 'solo@loernwerk.de', '', '', 'on'];
        for (const inputIndex in inputs) {
            expect(inputs[inputIndex].element.value).toBe(
                expectedValues[inputIndex]
            );
        }
    });

    test('Correctly update user', async () => {
        const updateAccount = vi.spyOn(AccountRestInterface, 'updateAccount');
        updateAccount.mockResolvedValueOnce();
        const wrapper = mount(AccountDetailsEditContainer, {
            props: {
                user: {
                    name: 'Han Solo',
                    mail: 'solo@loernwerk.de',
                    type: UserClass.ADMIN,
                    id: 1,
                },
                showadminview: true,
            },
        });

        const inputs = wrapper.findAll('input');
        const newValues = [
            'Carbon Solo',
            'carbon@loernwerk.de',
            'IAmCarbonite123',
            'IAmCarbonite123',
            '',
        ];
        for (const inputIndex in inputs) {
            await inputs[inputIndex].setValue(newValues[inputIndex]);
        }

        findComponentByText(wrapper, ButtonComponent, 'save')?.vm.$emit(
            'click'
        );
        await flushPromises();

        expect(updateAccount).toBeCalledTimes(1);
        expect(updateAccount).toBeCalledWith({
            id: 1,
            name: newValues[0],
            mail: newValues[1],
            password: newValues[2],
            type: UserClass.REGULAR,
        });
    });

    test('Incorrect user update - incorrect mail', async () => {
        const updateAccount = vi.spyOn(AccountRestInterface, 'updateAccount');
        const wrapper = mount(AccountDetailsEditContainer, {
            props: {
                user: {
                    name: 'Han Solo',
                    mail: 'solo@loernwerk.de',
                    type: UserClass.ADMIN,
                    id: 1,
                },
                showadminview: true,
            },
        });

        const inputs = wrapper.findAll('input');
        const newValues = [
            'Carbon Solo',
            'carbonMail',
            'IAmCarbonite123',
            'IAmCarbonite123',
            '',
        ];
        for (const inputIndex in inputs) {
            await inputs[inputIndex].setValue(newValues[inputIndex]);
        }

        findComponentByText(wrapper, ButtonComponent, 'save')?.vm.$emit(
            'click'
        );
        await flushPromises();

        expect(updateAccount).toBeCalledTimes(0);
        expect(wrapper.html()).toContain('invalidInput');
    });

    test('Incorrect user update - password mismatch', async () => {
        const updateAccount = vi.spyOn(AccountRestInterface, 'updateAccount');
        const wrapper = mount(AccountDetailsEditContainer, {
            props: {
                user: {
                    name: 'Han Solo',
                    mail: 'solo@loernwerk.de',
                    type: UserClass.ADMIN,
                    id: 1,
                },
                showadminview: true,
            },
        });

        const inputs = wrapper.findAll('input');
        const newValues = [
            'Carbon Solo',
            'carbon@loernwerk.de',
            'IAmCarbonite',
            'IAmCarbonite123',
            '',
        ];
        for (const inputIndex in inputs) {
            await inputs[inputIndex].setValue(newValues[inputIndex]);
        }

        findComponentByText(wrapper, ButtonComponent, 'save')?.vm.$emit(
            'click'
        );
        await flushPromises();

        expect(updateAccount).toBeCalledTimes(0);
        expect(wrapper.html()).toContain('invalidInput');
    });

    test('Incorrect user update - reject from server', async () => {
        const updateAccount = vi.spyOn(AccountRestInterface, 'updateAccount');
        updateAccount.mockImplementationOnce(() => {
            throw new LoernwerkError(
                'Testing Error',
                LoernwerkErrorCodes.UNKNOWN
            );
        });
        const wrapper = mount(AccountDetailsEditContainer, {
            props: {
                user: {
                    name: 'Han Solo',
                    mail: 'solo@loernwerk.de',
                    type: UserClass.ADMIN,
                    id: 1,
                },
                showadminview: true,
            },
        });

        const inputs = wrapper.findAll('input');
        const newValues = [
            'Carbon Solo',
            'carbon@loernwerk.de',
            'IAmCarbonite123',
            'IAmCarbonite123',
            '',
        ];
        for (const inputIndex in inputs) {
            await inputs[inputIndex].setValue(newValues[inputIndex]);
        }

        findComponentByText(wrapper, ButtonComponent, 'save')?.vm.$emit(
            'click'
        );
        await flushPromises();

        expect(updateAccount).toBeCalledTimes(1);
        expect(wrapper.html()).toContain('invalidInput');
    });

    test('Delete account', async () => {
        const deleteAccount = vi.spyOn(AccountRestInterface, 'deleteAccount');
        deleteAccount.mockResolvedValueOnce();
        const wrapper = mount(AccountDetailsEditContainer, {
            props: {
                user: {
                    name: 'Han Solo',
                    mail: 'solo@loernwerk.de',
                    type: UserClass.ADMIN,
                    id: 1,
                },
                showadminview: true,
            },
        });

        findComponentByText(wrapper, ButtonComponent, 'delete')?.vm.$emit(
            'click'
        );
        await flushPromises();

        expect(deleteAccount).toBeCalledTimes(1);
        expect(deleteAccount).toBeCalledWith(1);
        expect(wrapper.html()).toContain('deleted');
    });

    test('Changing user in an existing container', async () => {
        const wrapper = mount(AccountDetailsEditContainer, {
            props: {
                user: {
                    name: 'Han Solo',
                    mail: 'solo@loernwerk.de',
                    type: UserClass.ADMIN,
                    id: 1,
                },
                showadminview: true,
            },
        });

        let inputs = wrapper.findAll('input');
        let expectedValues = ['Han Solo', 'solo@loernwerk.de', '', '', 'on'];
        for (const inputIndex in inputs) {
            expect(inputs[inputIndex].element.value).toBe(
                expectedValues[inputIndex]
            );
        }

        wrapper.setProps({
            user: {
                name: 'Luke Skywalker',
                mail: 'lskywalker@loernwerk.de',
                type: UserClass.ADMIN,
                id: 3,
            },
            showadminview: true,
        });
        await flushPromises();

        inputs = wrapper.findAll('input');
        expectedValues = [
            'Luke Skywalker',
            'lskywalker@loernwerk.de',
            '',
            '',
            'on',
        ];
        for (const inputIndex in inputs) {
            expect(inputs[inputIndex].element.value).toBe(
                expectedValues[inputIndex]
            );
        }
    });
});
