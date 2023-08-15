import { flushPromises, mount } from '@vue/test-utils';
import { describe, test } from 'vitest';
import SequenceDisplayPreview from '../../../frontend/src/components/SequenceDisplayPreview.vue';
import PopupComponent from '../../../frontend/src/components/PopupComponent.vue';
import ButtonComponent from '../../../frontend/src/components/ButtonComponent.vue';
import { routerMock } from '../router_mock.setup';
import TagSequencePopupTab from '../../../frontend/src/components/sequenceOverviewPopUpTabs/TagSequencePopupTab.vue';
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

    const wrapper = mount(SequenceDisplayPreview, {
        props: {
            sequence: {
                ...baseSequence,
            },
        },
    });

    test('Renders correctly', async () => {
        expect(wrapper.text()).toContain(baseSequence.name);
        expect(wrapper.findComponent('[class="flex-1"').exists()).toBeTruthy();
        expect(wrapper.findComponent('[class=""]').exists()).toBeTruthy();
    });

    test('Popup opening and closing works', async () => {
        wrapper.vm.popupOpen = true;
        await wrapper.vm.$nextTick(() => {
            expect(wrapper.findComponent(PopupComponent).exists()).toBeTruthy();
            expect(wrapper.vm.shownTabs.length).toEqual(1);
        });
        await wrapper.findComponent(TagSequencePopupTab).vm.$emit('confirmed');
        await wrapper.vm.$nextTick(() => {
            expect(wrapper.findComponent(PopupComponent).exists()).toBeFalsy();
            expect(wrapper.emitted('reloadSequences')).toBeTruthy();
        });
    });

    test('Goto Sequence Edit', async () => {
        const editButton = wrapper.findAllComponents(ButtonComponent)[0];
        await editButton.vm.$emit('click');
        await flushPromises();
        await wrapper.vm.$nextTick(() => {
            expect(routerMock.push).toHaveBeenCalled();
            expect(routerMock.push).toHaveBeenCalledWith({
                name: 'Slide',
                params: {
                    sequenceCode: baseSequence.code,
                },
            });
        });
    });
});
