import TextDisplay from '../../../frontend/src/components/contentDisplay/TextDisplay.vue';
import TextDisplayHelper from './TextDisplayHelper.vue';
import { TextContent } from '../../../model/slide/content/TextContent';
import Delta from 'quill-delta';
import { mount } from '@vue/test-utils';
import { LayoutSlot } from '../../../model/slide/layout/Layout';

describe('TextDisplay', () => {
    test('Mounts text editor', async () => {
        const content = new TextContent();
        content.delta = new Delta();
        const wrapper = mount(TextDisplayHelper, {
            props: {
                textContent: content,
                editMode: true,
                layoutSlot: LayoutSlot.HEADER,
            },
            attachTo: document.body,
        });

        expect(wrapper.find('.ql-editor').exists()).toBe(true);
    });

    test('Mounts text editor with content', async () => {
        const content = new TextContent();
        content.delta = new Delta().insert('test');
        const wrapper = mount(TextDisplayHelper, {
            props: {
                textContent: content,
                editMode: true,
                layoutSlot: LayoutSlot.HEADER,
            },
            attachTo: document.body,
        });

        expect(wrapper.find('.ql-editor').text()).toBe('test');
    });

    test('Mounts text editor with content and formats', async () => {
        const content = new TextContent();
        content.delta = new Delta()
            .insert('test', { bold: true })
            .insert('123test');
        const wrapper = mount(TextDisplayHelper, {
            props: {
                textContent: content,
                editMode: true,
                layoutSlot: LayoutSlot.HEADER,
            },
            attachTo: document.body,
        });

        expect(wrapper.find('.ql-editor').text()).toBe('test123test');
        expect(wrapper.find('.ql-editor').find('strong').text()).toBe('test');
    });

    test('Modify text content', async () => {
        const content = new TextContent();
        content.delta = new Delta();
        const wrapper = mount(TextDisplay, {
            props: {
                textContent: content,
                editMode: true,
                layoutSlot: LayoutSlot.HEADER,
            },
            attachTo: document.body,
        });

        await wrapper.find('.ql-editor').trigger('focus');
        await wrapper.find('.ql-editor').trigger('keydown', { key: 'a' });
        await wrapper.find('.ql-editor').trigger('keydown', { key: 'b' });

        expect(wrapper.find('.ql-editor').text()).toBe('ab');

        await wrapper
            .find('.ql-editor')
            .trigger('keydown', { key: 'Backspace' });

        expect(wrapper.find('.ql-editor').text()).toBe('a');
    });
});
