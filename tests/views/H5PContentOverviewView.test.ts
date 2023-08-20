import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import { defineComponent } from 'vue';
import H5PContentOverviewView from '../../frontend/src/views/H5PContentOverviewView.vue';
import { AccountRestInterface } from '../../frontend/src/restInterfaces/AccountRestInterface';
import { H5PRestInterface } from '../../frontend/src/restInterfaces/H5PRestInterface';
import { UserClass } from '../../model/user/IUser';
import { findComponentByText } from '../component/TestUtilities';

describe('H5PContentOverviewView', () => {
    const SuspenseH5PContentOverview = defineComponent({
        components: { H5PContentOverviewView },
        template: '<Suspense><H5PContentOverviewView /></Suspense>',
    });

    test('Display H5P contents correctly', async () => {
        const getOwnAccount = vi.spyOn(AccountRestInterface, 'getOwnAccount');
        getOwnAccount.mockResolvedValueOnce({ type: UserClass.REGULAR });
        const getH5PContentList = vi.spyOn(
            H5PRestInterface,
            'getH5PContentList'
        );
        getH5PContentList.mockResolvedValueOnce([
            {
                contentId: '1',
                mainLibrary: 'Library',
                title: 'H5PContentA',
                usedSequences: ['ABCDEF', '123456'],
            },
        ]);
        const wrapper = mount(SuspenseH5PContentOverview, {
            global: {
                stubs: {
                    H5PEditor: true,
                },
            },
        });
        await flushPromises();

        expect(wrapper.html()).toContain('H5PContentA');
        expect(wrapper.html()).toContain('Library');
        expect(wrapper.html()).toContain('h5p.usedSequences: ABCDEF, 123456');
        expect(wrapper.html()).toContain('edit');
        expect(wrapper.html()).not.toContain('delete');
        expect(getOwnAccount).toBeCalledTimes(1);
        expect(getH5PContentList).toBeCalledTimes(1);
    });

    test('Impersonate user correctly', async () => {
        const getOwnAccount = vi.spyOn(AccountRestInterface, 'getOwnAccount');
        getOwnAccount.mockResolvedValueOnce({ type: UserClass.ADMIN });
        const getAccountMetaDataList = vi.spyOn(
            AccountRestInterface,
            'getAccountMetaDataList'
        );
        getAccountMetaDataList.mockResolvedValueOnce([
            { id: 0, name: 'admin' },
            { id: 69420, name: 'ToImpersonate' },
        ]);
        const getH5PContentList = vi.spyOn(
            H5PRestInterface,
            'getH5PContentList'
        );
        getH5PContentList.mockResolvedValueOnce([
            {
                contentId: '1',
                mainLibrary: 'Library',
                title: 'H5PContentA',
                usedSequences: ['ABCDEF', '123456'],
            },
        ]);
        const wrapper = mount(SuspenseH5PContentOverview, {
            global: {
                stubs: {
                    H5PEditor: true,
                },
            },
        });
        await flushPromises();

        getH5PContentList.mockResolvedValueOnce([
            {
                contentId: '3',
                mainLibrary: 'OtherLibrary',
                title: 'H5PContentB',
                usedSequences: ['AAAAAA', '111111', 'ZZZZZZ'],
            },
        ]);
        wrapper.find('select').setValue(69420);
        await flushPromises();

        expect(wrapper.html()).toContain('H5PContentB');
        expect(wrapper.html()).toContain('OtherLibrary');
        expect(wrapper.html()).toContain(
            'h5p.usedSequences: AAAAAA, 111111, ZZZZZZ'
        );
        expect(getH5PContentList).toBeCalledTimes(2);
        expect(getH5PContentList).lastCalledWith(69420);
    });

    test('Edit H5P Content', async () => {
        const getOwnAccount = vi.spyOn(AccountRestInterface, 'getOwnAccount');
        getOwnAccount.mockResolvedValueOnce({ type: UserClass.REGULAR });
        const getH5PContentList = vi.spyOn(
            H5PRestInterface,
            'getH5PContentList'
        );
        getH5PContentList.mockResolvedValueOnce([
            {
                contentId: '1',
                mainLibrary: 'Library',
                title: 'H5PContentA',
                usedSequences: ['ABCDEF', '123456'],
            },
        ]);
        const wrapper = mount(SuspenseH5PContentOverview, {
            global: {
                stubs: {
                    H5PEditor: true,
                },
            },
        });
        await flushPromises();

        findComponentByText(
            wrapper,
            { name: 'ButtonComponent' },
            'edit'
        )?.vm.$emit('click');
        await flushPromises();

        expect(
            wrapper.findComponent({ name: 'H5PEditor' }).props('contentId')
        ).toBe('1');
    });

    test('Delete H5P Content', async () => {
        const getOwnAccount = vi.spyOn(AccountRestInterface, 'getOwnAccount');
        getOwnAccount.mockResolvedValueOnce({ type: UserClass.REGULAR });
        const getH5PContentList = vi.spyOn(
            H5PRestInterface,
            'getH5PContentList'
        );
        getH5PContentList.mockResolvedValueOnce([
            {
                contentId: '1',
                mainLibrary: 'Library',
                title: 'H5PContentA',
                usedSequences: [],
            },
        ]);
        const deleteH5PContent = vi.spyOn(H5PRestInterface, 'deleteH5PContent');
        deleteH5PContent.mockResolvedValueOnce(undefined);
        const wrapper = mount(SuspenseH5PContentOverview, {
            global: {
                stubs: {
                    H5PEditor: true,
                },
            },
        });
        await flushPromises();

        getH5PContentList.mockResolvedValueOnce([]);
        findComponentByText(
            wrapper,
            { name: 'ButtonComponent' },
            'delete'
        )?.vm.$emit('click');
        await flushPromises();

        expect(deleteH5PContent).toBeCalledTimes(1);
        expect(deleteH5PContent).lastCalledWith('1');
    });
});
