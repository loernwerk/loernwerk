import { wrap } from 'module';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import DeleteSequencePopupTab from '../../frontend/src/components/sequenceOverviewPopUpTabs/DeleteSequencePopupTab.vue';
import ButtonComponent from '../../frontend/src/components/ButtonComponent.vue';
import { SequenceRestInterface } from '../../frontend/src/restInterfaces/SequenceRestInterface';

describe('DeleteSequencePopupTab', () => {
    test('correctly display value', () => {
        const wrapper = mount(DeleteSequencePopupTab, {
            props: {
                sequence: {
                    name: 'test',
                },
            },
        });
        console.log(wrapper.get('h1').html());
        expect(wrapper.get('h1').html()).toContain('test'); //i18n
    });

    test('emit on Button click', async () => {
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
        console.log(wrapper.emitted().delete.length);
        expect(deleteRest).toBeCalledTimes(1)
        expect(deleteRest).toBeCalledWith('ABCDEF')
        expect(wrapper.emitted().delete.length).toBe(1);
    });
});
