import { flushPromises, mount } from '@vue/test-utils';
import SlideOptionsTab from '../../frontend/src/components/sequenceEditOptionsTab/SlideOptionsTab.vue';
import TextInputComponent from '../../frontend/src/components/TextInputComponent.vue';
import ButtonComponent from '../../frontend/src/components/ButtonComponent.vue';

describe('SlideOptionsTab', () => {
    test('correctly display value', () => {
        const wrapper = mount(SlideOptionsTab, {
            props: {
                sequence: {
                    name: 'test',
                },
                slide: {
                    name: 'test',
                },
                disableButton: false,
            },
        });
        expect(wrapper.getComponent(TextInputComponent).html()).toContain(
            'test'
        );
    });

    test('emit on name change', async () => {
        const testseq = {
            name: 'test',
        };

        const testslide = {
            name: 'test',
        };

        const wrapper = mount(SlideOptionsTab, {
            props: {
                sequence: testseq,
                slide: testslide,
                disableButton: false,
            },
        });
        wrapper.get('input').setValue('test2');
        await flushPromises();
        testseq.name = 'test2';
        expect(wrapper.emitted()['update-sequence']).toBeTruthy();
        expect(wrapper.emitted()['update-sequence']).toEqual([[testseq]]);
    });

    test('emit on background change', async () => {
        const testseq = {
            name: 'test',
        };

        const testslide = {
            name: 'test',
            backgroundColor: 'ABCDEF',
        };

        const wrapper = mount(SlideOptionsTab, {
            props: {
                sequence: testseq,
                slide: testslide,
                disableButton: false,
            },
        });
        const newval = '123456';
        wrapper.findAll('input')[1].setValue(newval);
        await flushPromises();
        testslide.backgroundColor = newval;
        expect(wrapper.emitted()['update-slide']).toBeTruthy();
        expect(wrapper.emitted()['update-slide']).toEqual([[testslide]]);
    });

    test('saveButton', async () => {
        const testseq = {
            name: 'test',
        };

        const testslide = {
            name: 'test',
            backgroundColor: 'ABCDEF',
        };

        const wrapper = mount(SlideOptionsTab, {
            props: {
                sequence: testseq,
                slide: testslide,
                disableButton: false,
            },
        });

        await wrapper.getComponent(ButtonComponent).vm.$emit('click');

        await flushPromises();

        expect(wrapper.emitted().save).toBeTruthy();
    });
});
