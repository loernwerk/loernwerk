import { mount } from '@vue/test-utils';
import CodeInput from '../../frontend/src/components/CodeInput.vue';

describe('CodeInput', () => {
    test('Emit on filled Code input', async () => {
        const wrapper = mount(CodeInput, {
            props: {
                disableInputShowSpinner: false,
                showRedBorder: false,
            },
        });
        const input = wrapper.find('input');
        await input.setValue('123456');
        expect(wrapper.emitted()).toHaveProperty('code-entered');
    });

    test('Emit on emptied Code input', async () => {
        const wrapper = mount(CodeInput, {
            props: {
                disableInputShowSpinner: false,
                showRedBorder: false,
            },
        });
        const input = wrapper.find('input');
        await input.setValue('12345');
        await input.setValue('');
        expect(wrapper.emitted()).toHaveProperty('code-emptied');
    });
});
