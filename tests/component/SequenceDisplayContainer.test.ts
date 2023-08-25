import { mount } from '@vue/test-utils';
import { describe, test } from 'vitest';
import SequenceDisplayContainer from '../../frontend/src/components/SequenceDisplayContainer.vue';

describe('SequenceDisplayContainer', () => {
    test('Display sequences', async () => {
        const wrapper = mount(SequenceDisplayContainer, {
            props: {
                sequences: [{ name: 'SequenceOne' }, { name: 'SequenceTwo' }],
                name: 'Some Name',
                userId: -1,
            },
            global: {
                stubs: {
                    SequenceDisplayPreview: true,
                },
            },
        });

        expect(wrapper.find('h1').text()).toEqual('Some Name');
        const previews = wrapper.findAllComponents({
            name: 'SequenceDisplayPreview',
        });
        expect(previews[0].props('sequence')).toEqual({ name: 'SequenceOne' });
        expect(previews[0].props('userId')).toEqual(-1);
        expect(previews[1].props('sequence')).toEqual({ name: 'SequenceTwo' });
        expect(previews[1].props('userId')).toEqual(-1);
    });

    test('Emit reload sequences', async () => {
        const wrapper = mount(SequenceDisplayContainer, {
            props: {
                sequences: [{ name: 'SequenceOne' }],
                name: 'Some Name',
                userId: -1,
            },
            global: {
                stubs: {
                    SequenceDisplayPreview: true,
                },
            },
        });

        wrapper
            .findComponent({ name: 'SequenceDisplayPreview' })
            .vm.$emit('reloadSequences');

        expect(wrapper.emitted()).toHaveProperty('reloadSequences');
    });
});
