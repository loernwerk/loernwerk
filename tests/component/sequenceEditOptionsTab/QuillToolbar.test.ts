import {
    colors,
    fontFamilies,
    sizes,
} from '../../../frontend/src/components/contentDisplay/DesignOptions';
import QuillToolBar from '../../../frontend/src/components/sequenceEditOptionsTab/QuillToolBar.vue';
import { mount } from '@vue/test-utils';

describe('QuillToolBar', () => {
    test('Contains test format buttons', async () => {
        const wrapper = mount(QuillToolBar, {
            props: {
                id: 'test',
            },
        });

        expect(wrapper.find('.ql-bold').exists()).toBe(true);
        expect(wrapper.find('.ql-italic').exists()).toBe(true);
        expect(wrapper.find('.ql-underline').exists()).toBe(true);
    });

    test('Contains test alignment buttons', async () => {
        const wrapper = mount(QuillToolBar, {
            props: {
                id: 'test',
            },
        });

        expect(wrapper.find('.ql-align[value="left"]').exists()).toBe(true);
        expect(wrapper.find('.ql-align[value="center"]').exists()).toBe(true);
        expect(wrapper.find('.ql-align[value="right"]').exists()).toBe(true);
    });

    test('Contains fonts', async () => {
        const wrapper = mount(QuillToolBar, {
            props: {
                id: 'test',
            },
        });

        expect(wrapper.find('.ql-font').exists()).toBe(true);
        wrapper.findAll('.ql-font > option').forEach((element) => {
            expect(fontFamilies.includes(element.text())).toBe(true);
        });
        expect(wrapper.findAll('.ql-font > option').length).toBe(
            fontFamilies.length
        );
    });

    test('Contains font sizes', async () => {
        const wrapper = mount(QuillToolBar, {
            props: {
                id: 'test',
            },
        });

        expect(wrapper.find('.ql-size').exists()).toBe(true);
        wrapper.findAll('.ql-size > option').forEach((element) => {
            expect(element.text()).toMatch(/[0-9]+px/);
            expect(sizes.includes(element.text())).toBe(true);
        });

        expect(wrapper.findAll('.ql-size > option').length).toBe(sizes.length);
    });

    test('Color picker contains all colors', async () => {
        const wrapper = mount(QuillToolBar, {
            props: {
                id: 'test',
            },
        });

        wrapper.findAll<HTMLButtonElement>('.ql-color').forEach((element) => {
            if (element.element.value) {
                expect(colors.includes(element.element.value)).toBe(true);
            }
        });

        expect(wrapper.findAll('button.ql-color').length).toBe(
            colors.length + 1
        );
    });
});
