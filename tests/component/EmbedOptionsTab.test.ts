import EmbedOptionsTab from '../../frontend/src/components/sequenceEditOptionsTab/EmbedOptionsTab.vue';
import { mount } from '@vue/test-utils';

describe('EmbedOptionsTab', () => {
    test('correctly display value', () => {
        const wrapper = mount(EmbedOptionsTab, {
            props: { embedContent: {url: "piped.video"} },
        });

        expect(wrapper.get('input').element.value).toBe('piped.video');
    });

    test('correctly display value', () => {
        const wrapper = mount(EmbedOptionsTab, {
            props: { embedContent: {url: "piped.video"} },
        });

        wrapper.get('input').setValue('piped.video/123');
        const emitted = wrapper.emitted('update-content') as string[][];
        console.log(emitted);
        console.log(wrapper.emitted().input);
        expect(emitted[0][0]).toBe('piped.video/123');
    });
});