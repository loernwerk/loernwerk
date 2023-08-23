import EmbedOptionsTab from '../../../frontend/src/components/sequenceEditOptionsTab/EmbedOptionsTab.vue';
import { flushPromises, mount } from '@vue/test-utils';
import { EmbedContent } from '../../../model/slide/content/EmbedContent';

describe('EmbedOptionsTab', () => {
    test('correctly display value', () => {
        const wrapper = mount(EmbedOptionsTab, {
            props: { embedContent: { url: 'piped.video' } },
        });

        expect(wrapper.get('input').element.value).toBe('piped.video');
    });

    test('correct emit', async () => {
        const wrapper = mount(EmbedOptionsTab, {
            props: { embedContent: { url: 'piped.video' } },
        });

        wrapper.get('input').setValue('piped.video/123');
        await flushPromises();
        const emitted = wrapper.emitted('update-content') as string[][];
        expect((emitted[0][0] as unknown as EmbedContent).url).toBe(
            'piped.video/123'
        );
    });
});
