import { mount } from '@vue/test-utils';
import { describe, test } from 'vitest';
import DataSequencePopupTab from '../../../frontend/src/components/sequenceOverviewPopUpTabs/DataSequencePopupTab.vue';
import TextInputComponent from '../../../frontend/src/components/TextInputComponent.vue';
describe('SequenceDisplayPreview', () => {
    const baseSequence = {
        code: 'abcdef',
        name: 'Test',
        authorId: 0,
        creationDate: new Date(),
        modificationDate: new Date(),
        slideCount: 1,
        tags: [],
        readAccess: [],
        writeAccess: [],
    };

    const wrapper = mount(DataSequencePopupTab, {
        props: {
            sequence: {
                ...baseSequence,
            },
            modelValue: 'initialText',
        },
    });
    const inputComponents = wrapper.findAllComponents(TextInputComponent);

    test('Correct code is displayed', async () => {
        const codeComp = inputComponents[0];
        expect(codeComp.find('input').element.value).toEqual(baseSequence.code);
    });

    test('Correct link is displayed', async () => {
        const linkComp = inputComponents[1];
        expect(linkComp.find('input').element.value).toEqual(
            window.location.origin + '/' + baseSequence.code
        );
    });
});
