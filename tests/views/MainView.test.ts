import { flushPromises, mount } from '@vue/test-utils';
import MainView from '../../frontend/src/views/MainView.vue';
import ButtonComponentVue from '../../frontend/src/components/ButtonComponent.vue';
import { routerMock } from '../component/router_mock.setup';
import { vi } from 'vitest';
import CodeInput from '../../frontend/src/components/CodeInput.vue';
import { SequenceRestInterface } from '../../frontend/src/restInterfaces/SequenceRestInterface';

describe('MainView', () => {
    test('should render', async () => {
        const wrapper = mount(MainView);

        expect(wrapper.exists()).toBe(true);
    });

    test('redirect to login', async () => {
        const wrapper = mount(MainView);

        wrapper.findComponent(ButtonComponentVue).vm.$emit('click');
        await flushPromises();

        expect(routerMock.push).toHaveBeenCalled();
        expect(routerMock.push).toHaveBeenCalledWith({ name: 'LogIn' });
    });

    test('correct code input', async () => {
        vi.spyOn(
            SequenceRestInterface,
            'getMetadataForStudent'
        ).mockResolvedValue({});

        const wrapper = mount(MainView);

        wrapper.findComponent(CodeInput).find('input').setValue('123456');
        await flushPromises();

        expect(routerMock.push).toHaveBeenCalled();
        expect(routerMock.push).toHaveBeenCalledWith({
            name: 'Slide',
            params: { sequenceCode: '123456' },
        });
    });

    test('wrong code input', async () => {
        vi.spyOn(
            SequenceRestInterface,
            'getMetadataForStudent'
        ).mockImplementation((code: string) => {
            throw new Error(`${code} is not a valid sequence code`);
        });
        const wrapper = mount(MainView);

        wrapper.findComponent(CodeInput).find('input').setValue('123456');
        await flushPromises();

        expect(routerMock.push).not.toHaveBeenCalled();
    });
});
