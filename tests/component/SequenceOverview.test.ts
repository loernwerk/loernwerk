import { defineComponent } from 'vue';
import SequenceOverviewView from '../../frontend/src/views/SequenceOverviewView.vue';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, vi } from 'vitest';
import { SequenceRestInterface } from '../../frontend/src/restInterfaces/SequenceRestInterface';
import { AccountRestInterface } from '../../frontend/src/restInterfaces/AccountRestInterface';
import ButtonComponentVue from '../../frontend/src/components/ButtonComponent.vue';
import PopupNewSequenceVue from '../../frontend/src/components/PopupNewSequence.vue';

describe('SequenceOverviewView', () => {
    const SuspenseSequenceOverviewView = defineComponent({
        components: { SequenceOverviewView },
        template: '<Suspense><SequenceOverviewView/></Suspense>',
    });

    const ownSequencesTestArray = [
        {
            name: 'Hamming Code',
            creationDate: new Date(),
            modificationDate: new Date(),
            code: 'AAAAAA',
            authorId: 1,
            writeAccess: [],
            readAccess: [],
            slideCount: 0,
            tags: [],
        },
        {
            name: 'Huffman Codierung',
            creationDate: new Date(),
            modificationDate: new Date(),
            code: 'BBBBBB',
            authorId: 1,
            writeAccess: [],
            readAccess: [],
            slideCount: 0,
            tags: [],
        },
    ];

    const sharedSequencesTestArray = [
        {
            name: 'World Wide Web',
            creationDate: new Date(),
            modificationDate: new Date(),
            code: 'CCCCCC',
            authorId: 2,
            writeAccess: [],
            readAccess: [],
            slideCount: 0,
            tags: [],
        },
        {
            name: 'Electronic Mail',
            creationDate: new Date(),
            modificationDate: new Date(),
            code: 'DDDDDD',
            authorId: 2,
            writeAccess: [],
            readAccess: [],
            slideCount: 0,
            tags: [],
        },
    ];

    beforeEach(() => {
        const getOwnSequence = vi.spyOn(
            SequenceRestInterface,
            'getOwnSequences'
        );
        getOwnSequence.mockResolvedValueOnce(ownSequencesTestArray);

        const getSequencesSharedWithYou = vi.spyOn(
            SequenceRestInterface,
            'getSequencesSharedWithYou'
        );
        getSequencesSharedWithYou.mockResolvedValueOnce(
            sharedSequencesTestArray
        );

        const getOwnAccount = vi.spyOn(AccountRestInterface, 'getOwnAccount');
        getOwnAccount.mockResolvedValueOnce({ id: 1 });
    });

    test('Display overview correctly', async () => {
        const wrapper = mount(SuspenseSequenceOverviewView, {
            global: {
                stubs: {
                    PopupNewSequence: true,
                    SearchBarComponent: true,
                    SequenceDisplayContainer: true,
                },
            },
        });
        await flushPromises();

        expect(
            wrapper
                .findAllComponents({ name: 'SequenceDisplayContainer' })[0]
                .props('sequences')
        ).toEqual(ownSequencesTestArray);

        expect(
            wrapper
                .findAllComponents({ name: 'SequenceDisplayContainer' })[0]
                .props('userId')
        ).toEqual(1);

        expect(
            wrapper
                .findAllComponents({ name: 'SequenceDisplayContainer' })[1]
                .props('sequences')
        ).toEqual(sharedSequencesTestArray);

        expect(
            wrapper
                .findAllComponents({ name: 'SequenceDisplayContainer' })[1]
                .props('userId')
        ).toEqual(1);
    });
    test('Search', async () => {
        const wrapper = mount(SuspenseSequenceOverviewView, {
            global: {
                stubs: {
                    PopupNewSequence: true,
                    SequenceDisplayContainer: true,
                },
            },
        });
        await flushPromises();

        await wrapper.find('input').setValue('Ha');

        expect(
            wrapper
                .findAllComponents({ name: 'SequenceDisplayContainer' })[0]
                .props('sequences')
        ).toEqual([ownSequencesTestArray[0]]);

        expect(
            wrapper
                .findAllComponents({ name: 'SequenceDisplayContainer' })[1]
                .props('sequences')
        ).toEqual([]);

        await wrapper.find('input').setValue('Mail');

        expect(
            wrapper
                .findAllComponents({ name: 'SequenceDisplayContainer' })[0]
                .props('sequences')
        ).toEqual([]);

        expect(
            wrapper
                .findAllComponents({ name: 'SequenceDisplayContainer' })[1]
                .props('sequences')
        ).toEqual([sharedSequencesTestArray[1]]);
    });

    test('New Sequence Popup', async () => {
        const wrapper = mount(SuspenseSequenceOverviewView, {
            global: {
                stubs: {
                    PopupNewSequence: true,
                    SequenceDisplayContainer: true,
                },
            },
        });
        await flushPromises();

        expect(wrapper.findComponent(PopupNewSequenceVue).exists()).toBe(false);

        wrapper.getComponent(ButtonComponentVue).vm.$emit('click');

        expect(wrapper.findComponent(PopupNewSequenceVue).exists()).toBe(true);
    });
});
