import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import { ConfigRestInterface } from '../../frontend/src/restInterfaces/ConfigRestInterface';
import { AccountRestInterface } from '../../frontend/src/restInterfaces/AccountRestInterface';
import { RegistrationType } from '../../model/configuration/RegistrationType';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
} from '../../model/loernwerkError';
import { findComponentByText } from './TestUtilities';
import { routerMock } from './router_mock.setup';
import LogInView from '../../frontend/src/views/LogInView.vue';
import ButtonComponent from '../../frontend/src/components/ButtonComponent.vue';
import AccountCreationContainer from '../../frontend/src/components/admin/AccountCreationContainer.vue';
import { defineComponent } from 'vue';

describe('LoginView', () => {
    const SuspenseLogInView = defineComponent({
        components: { LogInView },
        template: '<Suspense><LogInView /></Suspense>',
    });

    test('Correct login', async () => {
        const getValue = vi.spyOn(ConfigRestInterface, 'getValue');
        const getOwnAccount = vi.spyOn(AccountRestInterface, 'getOwnAccount');
        const verifyLogin = vi.spyOn(AccountRestInterface, 'verifyLogin');
        getValue.mockResolvedValueOnce(RegistrationType.CLOSED);
        getOwnAccount.mockImplementationOnce(() => {
            throw new LoernwerkError(
                'Testing error',
                LoernwerkErrorCodes.UNKNOWN
            );
        });
        verifyLogin.mockResolvedValueOnce(true);

        const wrapper = mount(SuspenseLogInView);
        await flushPromises();
        const values = ['Qui-Gon Jinn', 'HesTheChosenOne', true];
        const inputs = wrapper.findAll('input');
        for (const inputIndex in inputs) {
            inputs[inputIndex].setValue(values[inputIndex]);
        }

        findComponentByText(
            wrapper,
            ButtonComponent,
            'account.login'
        )?.vm.$emit('click');
        await flushPromises();

        expect(verifyLogin).toBeCalledTimes(1);
        expect(verifyLogin).toBeCalledWith(
            'Qui-Gon Jinn',
            'HesTheChosenOne',
            true
        );
        expect(routerMock.push).toBeCalledTimes(1);
        expect(routerMock.push).toBeCalledWith({ name: 'Overview' });
    });

    test('Incorrect login', async () => {
        const getValue = vi.spyOn(ConfigRestInterface, 'getValue');
        const getOwnAccount = vi.spyOn(AccountRestInterface, 'getOwnAccount');
        const verifyLogin = vi.spyOn(AccountRestInterface, 'verifyLogin');
        getValue.mockResolvedValueOnce(RegistrationType.CLOSED);
        getOwnAccount.mockImplementationOnce(() => {
            throw new LoernwerkError(
                'Testing error',
                LoernwerkErrorCodes.UNKNOWN
            );
        });
        verifyLogin.mockResolvedValueOnce(false);

        const wrapper = mount(SuspenseLogInView);
        await flushPromises();
        const values = ['Obi-Wan Kenobi', 'HellooThere', false];
        const inputs = wrapper.findAll('input');
        for (const inputIndex in inputs) {
            inputs[inputIndex].setValue(values[inputIndex]);
        }

        findComponentByText(
            wrapper,
            ButtonComponent,
            'account.login'
        )?.vm.$emit('click');
        await flushPromises();

        expect(verifyLogin).toBeCalledTimes(1);
        expect(verifyLogin).toBeCalledWith(
            'Obi-Wan Kenobi',
            'HellooThere',
            false
        );
        expect(routerMock.push).toBeCalledTimes(0);
        expect(wrapper.html()).toContain('account.wrongLoginData');
    });

    test('Redirect after already being logged in', async () => {
        const getValue = vi.spyOn(ConfigRestInterface, 'getValue');
        const getOwnAccount = vi.spyOn(AccountRestInterface, 'getOwnAccount');
        getValue.mockResolvedValueOnce(RegistrationType.CLOSED);
        getOwnAccount.mockImplementationOnce(async () => {
            return {};
        });

        mount(SuspenseLogInView);
        await flushPromises();

        expect(routerMock.push).toBeCalledTimes(1);
        expect(routerMock.push).toBeCalledWith({ name: 'Overview' });
    });

    test('Open AccountCreation', async () => {
        const getValue = vi.spyOn(ConfigRestInterface, 'getValue');
        const getOwnAccount = vi.spyOn(AccountRestInterface, 'getOwnAccount');
        getValue.mockResolvedValueOnce(RegistrationType.INVITATION);
        getOwnAccount.mockImplementationOnce(async () => {
            throw new LoernwerkError(
                'Testing error',
                LoernwerkErrorCodes.UNKNOWN
            );
        });

        const wrapper = mount(SuspenseLogInView, {
            global: {
                stubs: {
                    AccountCreationContainer: true,
                },
            },
        });
        await flushPromises();
        findComponentByText(
            wrapper,
            ButtonComponent,
            'account.register'
        )?.vm.$emit('click');
        await flushPromises();

        const creationContainerComponent = wrapper.getComponent(
            AccountCreationContainer
        );
        expect(creationContainerComponent.props('requiresInviteCode')).toBe(
            true
        );
    });

    test('Register an account', async () => {
        const getValue = vi.spyOn(ConfigRestInterface, 'getValue');
        const getOwnAccount = vi.spyOn(AccountRestInterface, 'getOwnAccount');
        getValue.mockResolvedValueOnce(RegistrationType.INVITATION);
        getOwnAccount.mockImplementationOnce(async () => {
            throw new LoernwerkError(
                'Testing error',
                LoernwerkErrorCodes.UNKNOWN
            );
        });

        const wrapper = mount(SuspenseLogInView, {
            global: {
                stubs: {
                    AccountCreationContainer: true,
                },
            },
        });
        await flushPromises();
        findComponentByText(
            wrapper,
            ButtonComponent,
            'account.register'
        )?.vm.$emit('click');
        await flushPromises();
        wrapper.findComponent(AccountCreationContainer).vm.$emit('create');
        await flushPromises();

        expect(wrapper.html()).toContain('account.keepLoggedIn');
    });
});
