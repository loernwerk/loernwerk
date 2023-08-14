import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import DeleteSequencePopupTab from '../../frontend/src/components/sequenceOverviewPopUpTabs/DeleteSequencePopupTab.vue';
import ButtonComponent from '../../frontend/src/components/ButtonComponent.vue';
import { SequenceRestInterface } from '../../frontend/src/restInterfaces/SequenceRestInterface';
import { i18n_mock } from './translation_mock.setup';

describe('DeleteSequencePopupTab', () => {
    test('correctly display value', () => {
        const wrapper = mount(DeleteSequencePopupTab, {
            props: {
                sequence: {
                    name: 'test',
                },
            },
            mocks: {
                i18n_mock
            }
        });
        console.log(wrapper.get('h1').html());
    });

    test('emit on Button click and restinterface correct called', async () => {
        const deleteRest = vi.spyOn(SequenceRestInterface, "deleteSequence");
        deleteRest.mockResolvedValue(undefined);
        const wrapper = mount(DeleteSequencePopupTab, {
            props: {
                sequence: {
                    name: 'test',
                    code: 'ABCDEF'
                },
            },
        });

        //keine Ahnung warum das nicht funktioniert
        await wrapper.getComponent(ButtonComponent).vm.$emit('click');
        await flushPromises();
        expect(deleteRest).toBeCalledTimes(1)
        expect(deleteRest).toBeCalledWith('ABCDEF')
        expect(wrapper.emitted().delete.length).toBe(1);
    });
});
