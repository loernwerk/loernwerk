import { mount, flushPromises } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import { defineComponent } from 'vue';
import NavigationBar from '../../../frontend/src/components/navBar/NavigationBar.vue';
import { AccountRestInterface } from '../../../frontend/src/restInterfaces/AccountRestInterface';
import { UserClass } from '../../../model/user/IUser';
import { routerMock } from '../router_mock.setup';

describe('NavigationBar', () => {
    const SuspenseNavigationBar = defineComponent({
        components: { NavigationBar },
        props: ['darkMode'],
        emits: ['update:darkMode'],
        template:
            '<Suspense><NavigationBar :darkMode="darkMode" @update:darkMode="(val) => {$emit(`update:darkMode`, val)}" /></Suspense>',
    });

    test('Render correct links', async () => {
        const getOwnAccount = vi.spyOn(AccountRestInterface, 'getOwnAccount');
        getOwnAccount.mockResolvedValueOnce({ type: UserClass.REGULAR });

        const wrapper = mount(SuspenseNavigationBar, {
            props: {
                darkMode: true,
            },
            global: {
                stubs: {
                    NavigationBarItem: true,
                    LightDarkSwitch: true,
                    LanguageSelector: true,
                },
            },
        });
        await flushPromises();

        expect(
            wrapper.findAllComponents({ name: 'NavigationBarItem' }).length
        ).toBe(2);
        expect(
            wrapper.findComponent({ name: 'LightDarkSwitch' }).exists()
        ).toBeTruthy();
        expect(
            wrapper.findComponent({ name: 'LanguageSelector' }).exists()
        ).toBeTruthy();
    });

    test('Render correct admin links', async () => {
        const getOwnAccount = vi.spyOn(AccountRestInterface, 'getOwnAccount');
        getOwnAccount.mockResolvedValueOnce({ type: UserClass.ADMIN });

        const wrapper = mount(SuspenseNavigationBar, {
            props: {
                darkMode: true,
            },
            global: {
                stubs: {
                    NavigationBarItem: true,
                    LightDarkSwitch: true,
                    LanguageSelector: true,
                },
            },
        });
        await flushPromises();

        expect(
            wrapper.findAllComponents({ name: 'NavigationBarItem' }).length
        ).toBe(3);
        expect(
            wrapper.findComponent({ name: 'LightDarkSwitch' }).exists()
        ).toBeTruthy();
        expect(
            wrapper.findComponent({ name: 'LanguageSelector' }).exists()
        ).toBeTruthy();
    });

    test('Correct redirect if not logged in', async () => {
        const getOwnAccount = vi.spyOn(AccountRestInterface, 'getOwnAccount');
        getOwnAccount.mockRejectedValueOnce({});

        mount(SuspenseNavigationBar, {
            props: {
                darkMode: true,
            },
            global: {
                stubs: {
                    NavigationBarItem: true,
                    LightDarkSwitch: true,
                    LanguageSelector: true,
                },
            },
        });
        await flushPromises();

        expect(routerMock.push).toBeCalledTimes(1);
        expect(routerMock.push).toBeCalledWith({ name: 'LogIn' });
    });

    test('Correct darkMode emit', async () => {
        const getOwnAccount = vi.spyOn(AccountRestInterface, 'getOwnAccount');
        getOwnAccount.mockResolvedValueOnce({ type: UserClass.ADMIN });

        const wrapper = mount(SuspenseNavigationBar, {
            props: {
                darkMode: true,
            },
            global: {
                stubs: {
                    NavigationBarItem: true,
                    LightDarkSwitch: true,
                    LanguageSelector: true,
                },
            },
        });
        await flushPromises();

        wrapper
            .findComponent({ name: 'LightDarkSwitch' })
            .vm.$emit('update:modelValue', false);
        await flushPromises();

        expect(wrapper.emitted('update:darkMode')).toEqual([[false]]);
    });
});
