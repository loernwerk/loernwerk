import { mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import ToastComponent from '../../frontend/src/components/ToastComponent.vue';

describe('ToastComponent', () => {
    test('Mount correctly', async () => {
        vi.useFakeTimers();

        const wrapper = mount(ToastComponent, {
            props: {
                message: 'Message',
                time: 10,
            },
        });

        expect(wrapper.find('div').text()).toEqual('Message');
        expect(wrapper.find('.text-xs').attributes('style')).toEqual(
            'width: 100%;'
        );

        vi.useRealTimers();
    });
});
