import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import PopupNewSequence from '../../frontend/src/components/PopupNewSequence.vue';
import ButtonComponentVue from '../../frontend/src/components/ButtonComponent.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { SequenceRestInterface } from '../../frontend/src/restInterfaces/SequenceRestInterface';
import { routerMock } from './router_mock.setup';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
} from '../../model/loernwerkError';

describe('PopupNewSequence', () => {
    test('Enter name and click button', async () => {
        const addSequence = vi.spyOn(SequenceRestInterface, 'addSequence');
        addSequence.mockResolvedValueOnce('returned_code');

        const wrapper = mount(PopupNewSequence, {});

        await wrapper.find('input').setValue('New Sequence Title');

        wrapper.getComponent(ButtonComponentVue).vm.$emit('click');
        await flushPromises();

        expect(addSequence).toHaveBeenCalledTimes(1);
        expect(addSequence).toBeCalledWith('New Sequence Title');
        expect(routerMock.push).toHaveBeenCalledWith({
            name: 'SequenceEdit',
            params: { sequenceCode: 'returned_code' },
        });
    });

    test('Close popup', async () => {
        const wrapper = mount(PopupNewSequence, {});

        await wrapper.getComponent(FontAwesomeIcon).trigger('click');

        expect(wrapper.emitted()).toHaveProperty('closed');
    });

    test('Show error', async () => {
        const addSequence = vi.spyOn(SequenceRestInterface, 'addSequence');
        addSequence.mockImplementationOnce(() => {
            throw new LoernwerkError(
                'Testing Error',
                LoernwerkErrorCodes.UNKNOWN
            );
        });

        const wrapper = mount(PopupNewSequence, {});

        wrapper.getComponent(ButtonComponentVue).vm.$emit('click');
        await flushPromises();

        expect(addSequence).toHaveBeenCalledTimes(1);
        expect(wrapper.html()).toContain('sequence.creationError');
    });
});
