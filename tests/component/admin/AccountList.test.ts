import { mount } from '@vue/test-utils';
import { describe, test } from 'vitest';
import AccountList from '../../../frontend/src/components/admin/AccountList.vue';
import ButtonComponentVue from '../../../frontend/src/components/ButtonComponent.vue';
import { findComponentByText } from '../TestUtilities';

describe('AccountList', () => {
    test('Click "Create new user" button', async () => {
        const wrapper = mount(AccountList, {
            props: {
                accounts: [],
            },
        });

        findComponentByText(wrapper, ButtonComponentVue, 'create')?.vm.$emit(
            'click'
        );

        expect(wrapper.emitted()).toHaveProperty('createUser');
    });

    test('Search for user in list', async () => {
        const wrapper = mount(AccountList, {
            props: {
                accounts: [
                    { name: 'Tim Bernes-Lee', mail: 'lee@informatics.de' },
                    { name: 'Richard Hamming', mail: 'hamming@informatics.de' },
                    { name: 'David Huffman', mail: 'huffman@informatics.de' },
                ],
            },
        });

        expect(wrapper.findAllComponents(ButtonComponentVue).length).toBe(4);
        expect(wrapper.html()).toContain('Tim Bernes-Lee');
        expect(wrapper.html()).toContain('Richard Hamming');
        expect(wrapper.html()).toContain('David Huffman');

        await wrapper.find('input').setValue('a');
        expect(wrapper.html()).toContain('Richard Hamming');
        expect(wrapper.html()).toContain('David Huffman');
    });

    test('Select user from list', async () => {
        const wrapper = mount(AccountList, {
            props: {
                accounts: [
                    {
                        name: 'Tim Bernes-Lee',
                        mail: 'lee@informatics.de',
                        id: 100,
                    },
                    {
                        name: 'Richard Hamming',
                        mail: 'hamming@informatics.de',
                        id: 101,
                    },
                    {
                        name: 'David Huffman',
                        mail: 'huffman@informatics.de',
                        id: 110,
                    },
                ],
            },
        });

        findComponentByText(
            wrapper,
            ButtonComponentVue,
            'Tim Bernes-Lee'
        )?.vm.$emit('click');

        const selectedEvent = wrapper.emitted('selected') as string[][];

        expect(selectedEvent.length).toBe(1);
        expect(selectedEvent[0]).toEqual([100]);
    });
});
