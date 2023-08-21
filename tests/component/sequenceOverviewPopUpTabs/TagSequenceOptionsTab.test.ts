import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import TagSequencePopupTab from '../../../frontend/src/components/sequenceOverviewPopUpTabs/TagSequencePopupTab.vue';
import TextInputComponent from '../../../frontend/src/components/TextInputComponent.vue';
import { SequenceRestInterface } from '../../../frontend/src/restInterfaces/SequenceRestInterface';
import ButtonComponent from '../../../frontend/src/components/ButtonComponent.vue';
describe('TagSequencePopupTab', () => {
    const baseSequence = {
        code: 'ABCDEF',
        name: 'Test',
        authorId: 0,
        creationDate: new Date(),
        modificationDate: new Date(),
        slideCount: 1,
        tags: [],
        readAccess: [],
        writeAccess: [],
    };

    const wrapper = mount(TagSequencePopupTab, {
        props: {
            sequence: {
                ...baseSequence,
            },
        },
    });

    test('Tagging works and Tags are correctly set', async () => {
        const setTags = vi
            .spyOn(SequenceRestInterface, 'updateSequence')
            .mockResolvedValueOnce(undefined);
        await flushPromises();

        await wrapper
            .findComponent(TextInputComponent)
            .setValue('testTag,testTag2');
        await wrapper.findComponent(ButtonComponent).vm.$emit('click');
        await flushPromises();

        expect(wrapper.emitted()).toHaveProperty('confirmed');
        expect(wrapper.vm.tagsField).toBe('testTag,testTag2');
        expect(setTags).toHaveBeenCalled();
    });
});
