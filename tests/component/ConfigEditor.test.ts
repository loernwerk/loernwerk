import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import ConfigEditor from '../../frontend/src/components/admin/ConfigEditor.vue';
import ButtonComponent from '../../frontend/src/components/ButtonComponent.vue';
import { ConfigKey } from '../../model/configuration/ConfigKey';
import { RegistrationType } from '../../model/configuration/RegistrationType';
import { ConfigRestInterface } from '../../frontend/src/restInterfaces/ConfigRestInterface';

describe('ConfigEditor', () => {
    test('Display config settings correctly', () => {
        const wrapper = mount(ConfigEditor, {
            props: {
                entries: {
                    [ConfigKey.MAX_SEQUENCES_PER_USER]: -1,
                    [ConfigKey.MAX_SLIDES_PER_SEQUENCE]: 20,
                    [ConfigKey.REGISTRATION_TYPE]: RegistrationType.INVITATION,
                    [ConfigKey.REGISTRATION_CODES]: 'one,two,three',
                    [ConfigKey.REGISTRATION_CODES_EXPIRES_AFTER_USE]: true,
                },
            },
        });

        const expectedValues = ['', '20', 'one,two,three', true];
        const inputs = wrapper.findAll('input');
        const select = wrapper.find('select');
        for (const inputIndex in inputs) {
            const input = inputs[inputIndex];
            if (input.attributes('type') === 'checkbox') {
                expect(input.element.checked).toBe(expectedValues[inputIndex]);
            } else {
                expect(input.element.value).toBe(expectedValues[inputIndex]);
            }
        }
        expect(select.element.value).toBe(RegistrationType.INVITATION);
    });

    test('Correctly update config values', async () => {
        const setValue = vi.spyOn(ConfigRestInterface, 'setValue');
        setValue.mockResolvedValue(undefined);
        const wrapper = mount(ConfigEditor, {
            props: {
                entries: {
                    [ConfigKey.MAX_SEQUENCES_PER_USER]: -1,
                    [ConfigKey.MAX_SLIDES_PER_SEQUENCE]: 20,
                    [ConfigKey.REGISTRATION_TYPE]: RegistrationType.INVITATION,
                    [ConfigKey.REGISTRATION_CODES]: 'one,two,three',
                    [ConfigKey.REGISTRATION_CODES_EXPIRES_AFTER_USE]: true,
                },
            },
        });

        const newValues = ['3', '', 'one,two', false];
        const inputs = wrapper.findAll('input');
        const select = wrapper.find('select');
        for (const inputIndex in inputs) {
            const input = inputs[inputIndex];
            input.setValue(newValues[inputIndex]);
        }
        select.setValue(RegistrationType.CLOSED);

        await wrapper.getComponent(ButtonComponent).vm.$emit('click');
        await flushPromises();

        expect(setValue).toBeCalledTimes(5);
        expect(setValue).toBeCalledWith(ConfigKey.MAX_SEQUENCES_PER_USER, 3);
        expect(setValue).toBeCalledWith(ConfigKey.MAX_SLIDES_PER_SEQUENCE, -1);
        expect(setValue).toBeCalledWith(
            ConfigKey.REGISTRATION_TYPE,
            RegistrationType.CLOSED
        );
        expect(setValue).toBeCalledWith(
            ConfigKey.REGISTRATION_CODES,
            'one,two'
        );
        expect(setValue).toBeCalledWith(
            ConfigKey.REGISTRATION_CODES_EXPIRES_AFTER_USE,
            false
        );
        expect(wrapper.emitted()).toHaveProperty('save');

        setValue.mockClear();
    });

    test('Failing because inputting text in number field', async () => {
        const setValue = vi.spyOn(ConfigRestInterface, 'setValue');
        const wrapper = mount(ConfigEditor, {
            props: {
                entries: {
                    [ConfigKey.MAX_SEQUENCES_PER_USER]: -1,
                    [ConfigKey.MAX_SLIDES_PER_SEQUENCE]: 20,
                    [ConfigKey.REGISTRATION_TYPE]: RegistrationType.INVITATION,
                    [ConfigKey.REGISTRATION_CODES]: 'one,two,three',
                    [ConfigKey.REGISTRATION_CODES_EXPIRES_AFTER_USE]: true,
                },
            },
        });

        wrapper.find('input').setValue('This is not a number');
        await wrapper.getComponent(ButtonComponent).vm.$emit('click');
        await flushPromises();

        expect(wrapper.html()).toContain('config.invalidInput');
        expect(setValue).toBeCalledTimes(0);
        expect(wrapper.emitted()).not.toHaveProperty('save');
    });
});
