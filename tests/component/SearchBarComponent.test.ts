import { mount } from '@vue/test-utils';
import { describe, test } from 'vitest';
import SearchBarComponent from '../../frontend/src/components/SearchBarComponent.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

describe('SearchBarComponent', () => {
    test('Search by input', async () => {
        const wrapper = mount(SearchBarComponent, {});

        await wrapper.find('input').setValue('Search123!%');

        const inputChangedEvent = wrapper.emitted(
            'input-changed'
        ) as string[][];

        expect(inputChangedEvent.length).toBe(1);
        expect(inputChangedEvent[0]).toEqual(['Search123!%']);
    });

    test('Search by click on icon', async () => {
        const wrapper = mount(SearchBarComponent, {});

        await wrapper.getComponent(FontAwesomeIcon).trigger('click');

        expect(wrapper.emitted('search-clicked')?.length).toBe(1);
    });

    test('Standard placeholder', async () => {
        const wrapper = mount(SearchBarComponent, {});

        expect(wrapper.find('input').attributes('placeholder')).toBe(
            'search...'
        );
    });

    test('Standard placeholder', async () => {
        const wrapper = mount(SearchBarComponent, {
            props: {
                placeHolder: 'PlaceHolder',
            },
        });

        expect(wrapper.find('input').attributes('placeholder')).toBe(
            'PlaceHolder'
        );
    });
});
