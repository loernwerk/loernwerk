import { flushPromises, mount } from '@vue/test-utils';
import { describe, test } from 'vitest';
import LightDarkSwitch from '../../../frontend/src/components/navBar/LightDarkSwitch.vue';

describe('LightDarkSwitch', () => {
    test('Correctly display value - on', () => {
        const wrapper = mount(LightDarkSwitch, {
            props: { modelValue: true },
        });

        expect(wrapper.get('input').element.checked).toBe(true);
    });

    test('Correctly display value - off', () => {
        const wrapper = mount(LightDarkSwitch, {
            props: { modelValue: false },
        });

        expect(wrapper.get('input').element.checked).toBe(false);
    });

    test('Switch value by clicking - on to off', async () => {
        const wrapper = mount(LightDarkSwitch, {
            props: { modelValue: true },
        });

        await wrapper.get('input').setValue(false);
        await flushPromises();

        const modelValueEmit = wrapper.emitted(
            'update:modelValue'
        ) as boolean[][];
        expect(modelValueEmit.length).toBe(1);
        expect(modelValueEmit[0]).toEqual([false]);
    });

    test('Switch value by clicking - off to on', async () => {
        const wrapper = mount(LightDarkSwitch, {
            props: { modelValue: false },
        });

        await wrapper.get('input').setValue(true);
        await flushPromises();

        const modelValueEmit = wrapper.emitted(
            'update:modelValue'
        ) as boolean[][];
        expect(modelValueEmit.length).toBe(1);
        expect(modelValueEmit[0]).toEqual([true]);
    });

    test('Switch value by changing prop - on to off', async () => {
        const wrapper = mount(LightDarkSwitch, {
            props: { modelValue: true },
        });

        await wrapper.setProps({ modelValue: false });
        await flushPromises();

        expect(wrapper.get('input').element.checked).toBe(false);
        const modelValueEmit = wrapper.emitted(
            'update:modelValue'
        ) as boolean[][];
        expect(modelValueEmit.length).toBe(1);
        expect(modelValueEmit[0]).toEqual([false]);
    });

    test('Switch value by changing prop - off to on', async () => {
        const wrapper = mount(LightDarkSwitch, {
            props: { modelValue: false },
        });

        await wrapper.setProps({ modelValue: true });
        await flushPromises();

        expect(wrapper.get('input').element.checked).toBe(true);
        const modelValueEmit = wrapper.emitted(
            'update:modelValue'
        ) as boolean[][];
        expect(modelValueEmit.length).toBe(1);
        expect(modelValueEmit[0]).toEqual([true]);
    });
});
