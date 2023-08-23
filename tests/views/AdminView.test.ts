import { defineComponent } from 'vue';
import AdminView from '../../frontend/src/views/AdminView.vue';
import { vi } from 'vitest';
import { AccountRestInterface } from '../../frontend/src/restInterfaces/AccountRestInterface';
import { flushPromises, mount } from '@vue/test-utils';
import AccountList from '../../frontend/src/components/admin/AccountList.vue';
import { UserClass } from '../../model/user/IUser';
import { ConfigRestInterface } from '../../frontend/src/restInterfaces/ConfigRestInterface';
import ButtonComponent from '../../frontend/src/components/ButtonComponent.vue';
import { RegistrationType } from '../../model/configuration/RegistrationType';
import AccountDetailsEditContainer from '../../frontend/src/components/AccountDetailsEditContainer.vue';
import { SequenceRestInterface } from '../../frontend/src/restInterfaces/SequenceRestInterface';
import AccountSequenceContainer from '../../frontend/src/components/admin/AccountSequenceContainer.vue';
import PopupComponent from '../../frontend/src/components/PopupComponent.vue';
import ConfigEditor from '../../frontend/src/components/admin/ConfigEditor.vue';

const wrapperView = defineComponent({
    components: { AdminView },
    template: '<Suspense><AdminView /></Suspense>',
});

describe('Admin View', () => {
    const firstUser = {
        id: 2,
        name: 'Gukesh D',
        mail: 'gukesh@d.de',
        type: UserClass.REGULAR,
        password: 'password',
        sharedSequencesReadAccess: [],
        sharedSequencesWriteAccess: [],
    };
    const secondUser = {
        id: 1,
        name: 'Magnus Carlsen',
        mail: 'carlsen@magnus.de',
        type: UserClass.ADMIN,
        password: 'password',
        sharedSequencesReadAccess: [],
        sharedSequencesWriteAccess: [],
    };
    beforeAll(() => {
        vi.spyOn(
            AccountRestInterface,
            'getAccountMetaDataList'
        ).mockResolvedValue([firstUser, secondUser]);

        vi.spyOn(ConfigRestInterface, 'getAllValue').mockResolvedValue({
            max_sequences_per_user: 'unlimited',
            max_slides_per_sequence: 'unlimited',
            registration_type: RegistrationType.CLOSED,
            registration_codes: null,
            registration_codes_expires_after_use: null,
        });
    });

    test('should render', async () => {
        const wrapper = mount(wrapperView);
        await flushPromises();

        expect(wrapper.findComponent(AdminView).exists()).toBe(true);
    });

    test('should render account list', async () => {
        const wrapper = mount(wrapperView);

        await flushPromises();
        const accounts = wrapper.findComponent(AccountList);

        expect(accounts.exists()).toBe(true);

        expect(wrapper.findAllComponents(ButtonComponent).length).toEqual(4);
    });

    test('Menu ist rendered when Account is selected', async () => {
        vi.spyOn(AccountRestInterface, 'getAccount').mockResolvedValue(
            firstUser
        );
        vi.spyOn(SequenceRestInterface, 'getSequenceByUser').mockResolvedValue([
            {
                name: 'Sequence',
                code: 'CODE66',
                authorId: firstUser.id,
                creationDate: new Date(),
                modificationDate: new Date(),
                writeAccess: [],
                readAccess: [],
                slideCount: 1,
                tags: null,
            },
        ]);
        const wrapper = mount(wrapperView);
        await flushPromises();

        const accounts = wrapper.findComponent(AccountList);
        await flushPromises();

        await accounts.vm.$emit('selected', firstUser.id);
        await flushPromises();

        expect(
            wrapper.findComponent(AccountDetailsEditContainer).exists()
        ).toBeTruthy();
        expect(
            wrapper.findComponent(AccountSequenceContainer).exists()
        ).toBeTruthy();
    });

    test('Config Editor', async () => {
        const wrapper = mount(wrapperView);
        await flushPromises();

        const openConfigEditor = wrapper.findAllComponents(ButtonComponent)[3];
        await openConfigEditor.vm.$emit('click');
        expect(wrapper.findComponent(PopupComponent).exists()).toBeTruthy();
        expect(wrapper.findComponent(ConfigEditor).exists()).toBeTruthy();
        await wrapper.findComponent(ConfigEditor).vm.$emit('save');
        await flushPromises();

        expect(ConfigRestInterface.getAllValue).toHaveBeenCalled();
    });
});
