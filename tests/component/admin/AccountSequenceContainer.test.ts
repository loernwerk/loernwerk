import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import AccountSequenceContainer from '../../../frontend/src/components/admin/AccountSequenceContainer.vue';
import ButtonComponent from '../../../frontend/src/components/ButtonComponent.vue';
import { findComponentByText } from '../TestUtilities';
import { routerMock } from '../router_mock.setup';
import { SequenceRestInterface } from '../../../frontend/src/restInterfaces/SequenceRestInterface';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
} from '../../../model/loernwerkError';

describe('AccountSequenceContainer', () => {
    test('Show sequences', () => {
        const wrapper = mount(AccountSequenceContainer, {
            props: {
                sequences: [
                    {
                        name: 'Episode I - The Phantom Menace',
                        code: 'EPI',
                    },
                    {
                        name: 'Episode II - Attack of the Clones',
                        code: 'EPII',
                    },
                    {
                        name: 'Episode III - Revenge of the Sith',
                        code: 'EPIII',
                    },
                ],
            },
        });

        expect(wrapper.text()).toContain('Episode I - The Phantom Menace');
        expect(wrapper.text()).toContain('Episode II - Attack of the Clones');
        expect(wrapper.text()).toContain('Episode III - Revenge of the Sith');
    });

    test('Open sequence to edit', async () => {
        const wrapper = mount(AccountSequenceContainer, {
            props: {
                sequences: [
                    {
                        name: 'Episode IV - A New Hope',
                        code: 'EPIV',
                    },
                    {
                        name: 'Episode V - The Empire Strikes Back',
                        code: 'EPV',
                    },
                    {
                        name: 'Episode VI - Return of the Jedi',
                        code: 'EPVI',
                    },
                ],
            },
        });

        findComponentByText(wrapper, ButtonComponent, 'show')?.vm.$emit(
            'click'
        );
        await flushPromises();

        expect(routerMock.push).toBeCalledTimes(1);
        expect(routerMock.push).toBeCalledWith({
            name: 'Slide',
            params: { sequenceCode: 'EPIV' },
        });
    });

    test('Delete a sequence', async () => {
        const deleteSequence = vi.spyOn(
            SequenceRestInterface,
            'deleteSequence'
        );
        deleteSequence.mockResolvedValueOnce(undefined);

        const wrapper = mount(AccountSequenceContainer, {
            props: {
                sequences: [
                    {
                        name: 'Episode VII – The Force Awakens',
                        code: 'EPVII',
                    },
                    {
                        name: 'Episode VIII – The Last Jedi',
                        code: 'EPVIII',
                    },
                    {
                        name: 'Episode IX – The Rise of Skywalker',
                        code: 'EPIX',
                    },
                ],
            },
        });

        findComponentByText(wrapper, ButtonComponent, 'delete')?.vm.$emit(
            'click'
        );
        await flushPromises();

        expect(deleteSequence).toBeCalledTimes(1);
        expect(deleteSequence).toBeCalledWith('EPVII');
        expect(wrapper.emitted()).toHaveProperty('delete');
    });

    test('Failing to delete a sequence', async () => {
        const deleteSequence = vi.spyOn(
            SequenceRestInterface,
            'deleteSequence'
        );
        deleteSequence.mockImplementationOnce(() => {
            throw new LoernwerkError(
                'Testing Error',
                LoernwerkErrorCodes.UNKNOWN
            );
        });

        const wrapper = mount(AccountSequenceContainer, {
            props: {
                sequences: [
                    {
                        name: 'Episode VII – The Force Awakens',
                        code: 'EPVII',
                    },
                    {
                        name: 'Episode VIII – The Last Jedi',
                        code: 'EPVIII',
                    },
                    {
                        name: 'Episode IX – The Rise of Skywalker',
                        code: 'EPIX',
                    },
                ],
            },
        });

        findComponentByText(wrapper, ButtonComponent, 'delete')?.vm.$emit(
            'click'
        );
        await flushPromises();

        expect(deleteSequence).toBeCalledTimes(1);
        expect(deleteSequence).toBeCalledWith('EPVII');
        expect(wrapper.html()).toContain('failed');
    });
});
