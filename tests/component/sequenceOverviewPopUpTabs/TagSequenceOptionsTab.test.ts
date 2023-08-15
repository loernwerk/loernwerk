import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import TagSequencePopupTab from '../../../frontend/src/components/sequenceOverviewPopUpTabs/TagSequencePopupTab.vue';
import TextInputComponent from '../../../frontend/src/components/TextInputComponent.vue';
import { SequenceRestInterface } from '../../../frontend/src/restInterfaces/SequenceRestInterface';
import ButtonComponent from '../../../frontend/src/components/ButtonComponent.vue';
describe('SequenceDisplayPreview', () => {
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
            .mockResolvedValue(undefined);

        await flushPromises();

        await wrapper
            .findComponent(TextInputComponent)
            .setValue('testTag,testTag2');
        await wrapper.findComponent(ButtonComponent).trigger('click');
        await wrapper.vm.$nextTick(() => {
            wrapper.vm.confirmChanges();
            expect(wrapper.emitted('confirmed'));
        });
        expect(wrapper.vm.tagsField).toBe('testTag,testTag2');
        expect(setTags).toHaveBeenCalled();
    });
});
