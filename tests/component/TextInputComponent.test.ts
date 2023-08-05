import { flushPromises, mount } from '@vue/test-utils';
import TextInputComponent from '../../frontend/src/components/TextInputComponent.vue';

describe('TextInputComponent', () => {
    test('Correctly display value', () => {
        const wrapper = mount(TextInputComponent, {
            props: { modelValue: 'test' },
        });

        expect(wrapper.get('input').element.value).toBe('test');
    });

    test('Emit value on input', async () => {
        const wrapper = mount(TextInputComponent, {
            props: { modelValue: 'test' },
        });

        await wrapper.get('input').setValue('test2');
        await wrapper.get('input').setValue('test3');
        await wrapper.get('input').setValue('test4');
        await flushPromises();

        const modelValueEmit = wrapper.emitted(
            'update:modelValue'
        ) as string[][];
        expect(modelValueEmit.length).toBe(3);
        expect(modelValueEmit[0]).toEqual(['test2']);
        expect(modelValueEmit[1]).toEqual(['test3']);
        expect(modelValueEmit[2]).toEqual(['test4']);
    });

    test('Correct Display on prop change', async () => {
        const wrapper = mount(TextInputComponent, {
            props: { modelValue: 'test' },
        });

        expect(wrapper.get('input').element.value).toBe('test');

        await wrapper.setProps({ modelValue: 'test2' });
        await flushPromises();

        expect(wrapper.get('input').element.value).toBe('test2');
    });
});
