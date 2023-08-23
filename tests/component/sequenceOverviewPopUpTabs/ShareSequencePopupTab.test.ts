import ShareSequencePopupTabHelper from './ShareSequencePopupTabHelper.vue';
import { flushPromises, mount } from '@vue/test-utils';
import { AccountRestInterface } from '../../../frontend/src/restInterfaces/AccountRestInterface';
import { vi } from 'vitest';
import { findComponentByText } from '../TestUtilities';
import ButtonComponentVue from '../../../frontend/src/components/ButtonComponent.vue';
import { SequenceRestInterface } from '../../../frontend/src/restInterfaces/SequenceRestInterface';

const baseSequence = {
    code: 'abcdef',
    name: 'Test',
    authorId: 0,
    creationDate: new Date(),
    modificationDate: new Date(),
    slideCount: 1,
    tags: [],
};

describe('ShareSequencePopupTab', () => {
    beforeAll(() => {
        vi.spyOn(AccountRestInterface, 'getAccounts').mockResolvedValue({
            1: 'User 1',
            2: 'User 2',
            3: 'User 3',
            4: 'User 4',
        });
    });

    test('No shares displayed correctly', async () => {
        const wrapper = mount(ShareSequencePopupTabHelper, {
            props: {
                sequence: {
                    ...baseSequence,
                    readAccess: [],
                    writeAccess: [],
                },
            },
        });

        expect(wrapper.text()).not.toContain('sequence.teacherWith:');
    });

    test('Shares displayed correctly', async () => {
        const wrapper = mount(ShareSequencePopupTabHelper, {
            props: {
                sequence: {
                    ...baseSequence,
                    readAccess: [1, 3],
                    writeAccess: [2],
                },
            },
        });

        await flushPromises();

        expect(wrapper.text()).toContain('sequence.teacherWith:');
        expect(wrapper.text()).toContain('User 1');
        expect(wrapper.text()).toContain('User 2');
        expect(wrapper.text()).toContain('User 3');

        const tableShareRead = wrapper.findAll('table')[0];
        const tableShareWrite = wrapper.findAll('table')[1];

        expect(tableShareRead.findAll('tr').length).toBe(2);
        expect(tableShareRead.text()).toContain('User 1');
        expect(tableShareRead.text()).toContain('User 3');
        expect(tableShareWrite.findAll('tr').length).toBe(1);
        expect(tableShareWrite.text()).toContain('User 2');
    });

    test('Share - Read Access', async () => {
        const save = vi
            .spyOn(SequenceRestInterface, 'updateSequence')
            .mockResolvedValue(undefined);
        vi.spyOn(
            AccountRestInterface,
            'getAccountByUserName'
        ).mockResolvedValue({ id: 1 });

        const wrapper = mount(ShareSequencePopupTabHelper, {
            props: {
                sequence: {
                    ...baseSequence,
                    readAccess: [],
                    writeAccess: [],
                },
            },
            attachTo: document.body,
        });

        await flushPromises();

        expect(wrapper.text()).not.toContain('sequence.teacherWith:');
        expect(wrapper.text()).not.toContain('User 1');

        await wrapper.find('input').setValue('1');

        findComponentByText(
            wrapper,
            ButtonComponentVue,
            'sequence.share'
        )?.vm.$emit('click');

        await flushPromises();
        expect(save).toHaveBeenCalled();

        expect(wrapper.text()).toContain('sequence.teacherWith:');
        expect(wrapper.text()).toContain('User 1');

        expect(wrapper.findAll('table')[0].text()).toContain('User 1');
    });

    test('Share - Write Access', async () => {
        const save = vi
            .spyOn(SequenceRestInterface, 'updateSequence')
            .mockResolvedValue(undefined);
        vi.spyOn(
            AccountRestInterface,
            'getAccountByUserName'
        ).mockResolvedValue({ id: 1 });

        const wrapper = mount(ShareSequencePopupTabHelper, {
            props: {
                sequence: {
                    ...baseSequence,
                    readAccess: [],
                    writeAccess: [],
                },
            },
            attachTo: document.body,
        });

        await flushPromises();

        expect(wrapper.text()).not.toContain('sequence.teacherWith:');
        expect(wrapper.text()).not.toContain('User 1');

        await wrapper.find('input').setValue('1');
        await wrapper.find('select').setValue(true);

        findComponentByText(
            wrapper,
            ButtonComponentVue,
            'sequence.share'
        )?.vm.$emit('click');

        await flushPromises();
        expect(save).toHaveBeenCalled();

        expect(wrapper.text()).toContain('sequence.teacherWith:');
        expect(wrapper.text()).toContain('User 1');

        expect(wrapper.findAll('table')[1].text()).toContain('User 1');
    });

    test('Share with self', async () => {
        const save = vi
            .spyOn(SequenceRestInterface, 'updateSequence')
            .mockResolvedValue(undefined);
        vi.spyOn(
            AccountRestInterface,
            'getAccountByUserName'
        ).mockResolvedValue({ id: 0 });

        const wrapper = mount(ShareSequencePopupTabHelper, {
            props: {
                sequence: {
                    ...baseSequence,
                    readAccess: [],
                    writeAccess: [],
                },
            },
            attachTo: document.body,
        });

        await flushPromises();

        await wrapper.find('input').setValue('0');

        findComponentByText(
            wrapper,
            ButtonComponentVue,
            'sequence.share'
        )?.vm.$emit('click');

        await flushPromises();
        expect(save).not.toHaveBeenCalled();
    });

    test('Share with user that already has access', async () => {
        const save = vi
            .spyOn(SequenceRestInterface, 'updateSequence')
            .mockResolvedValue(undefined);
        vi.spyOn(
            AccountRestInterface,
            'getAccountByUserName'
        ).mockResolvedValue({ id: 1 });

        const wrapper = mount(ShareSequencePopupTabHelper, {
            props: {
                sequence: {
                    ...baseSequence,
                    readAccess: [1],
                    writeAccess: [],
                },
            },
            attachTo: document.body,
        });

        await flushPromises();

        await wrapper.find('input').setValue('1');

        findComponentByText(
            wrapper,
            ButtonComponentVue,
            'sequence.share'
        )?.vm.$emit('click');

        await flushPromises();
        expect(save).not.toHaveBeenCalled();
    });
});
