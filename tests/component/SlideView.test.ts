import { defineComponent } from 'vue';
import SlideView from '../../frontend/src/views/SlideView.vue';
import { SequenceRestInterface } from '../../frontend/src/restInterfaces/SequenceRestInterface';
import ButtonComponent from '../../frontend/src/components/ButtonComponent.vue';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import { routerMock } from './router_mock.setup';
import { LayoutType } from '../../model/slide/layout/Layout';

describe('SlideView', () => {
    const SuspenseSlideView = defineComponent({
        components: { SlideView },
        template: '<Suspense><SlideView :sequenceCode="code" /></Suspense>',
        props: {
            code: String,
        },
    });

    test('correct Sequence fetch call', async () => {
        const getMetadata = vi.spyOn(
            SequenceRestInterface,
            'getMetadataForStudent'
        );
        getMetadata.mockResolvedValueOnce({
            name: 'test',
            code: '123456',
            creationDate: new Date(),
            modificationDate: new Date(),
            authorId: 1,
            writeAccess: [],
            readAccess: [],
            tags: [],
            slideCount: 1,
        });
        const wrapper = mount(SuspenseSlideView, {
            props: {
                code: '123456',
            },
        });

        void wrapper;

        await flushPromises();

        expect(getMetadata).toBeCalledTimes(1);
        expect(getMetadata).toBeCalledWith('123456');
    });

    test('correct follow up calls', async () => {
        const getMetadata = vi.spyOn(
            SequenceRestInterface,
            'getMetadataForStudent'
        );
        const getSlide = vi.spyOn(SequenceRestInterface, 'getSlide');

        getMetadata.mockResolvedValueOnce({
            name: 'test',
            code: '123456',
            creationDate: new Date(),
            modificationDate: new Date(),
            authorId: 1,
            writeAccess: [],
            readAccess: [],
            tags: [],
            slideCount: 1,
        });

        getSlide.mockResolvedValueOnce({
            layout: LayoutType.TITLEPAGE,
            content: {},
            backgroundColor: 'test',
            sequenceCode: '0',
            order: 0,
            id: 12391,
        });

        mount(SuspenseSlideView, {
            props: {
                code: '123456',
            },
        });

        await flushPromises();

        expect(getMetadata).toBeCalledTimes(1);
        expect(getMetadata).toBeCalledWith('123456');

        expect(routerMock.push).toBeCalledTimes(0);

        expect(getSlide).toBeCalledTimes(1);
        expect(getSlide).toBeCalledWith('123456', 0);
    });

    test('correct router call', async () => {
        const getMetadata = vi.spyOn(
            SequenceRestInterface,
            'getMetadataForStudent'
        );
        const getSlide = vi.spyOn(SequenceRestInterface, 'getSlide');

        getMetadata.mockResolvedValueOnce({
            name: 'test',
            code: '123456',
            creationDate: new Date(),
            modificationDate: new Date(),
            authorId: 1,
            writeAccess: [],
            readAccess: [],
            tags: [],
            slideCount: 1,
        });

        getSlide.mockResolvedValueOnce({
            layout: LayoutType.TITLEPAGE,
            content: {},
            backgroundColor: 'test',
            sequenceCode: '0',
            order: 0,
            id: 12391,
        });

        const wrapper = mount(SuspenseSlideView, {
            props: {
                code: '123456',
            },
        });

        await flushPromises();

        expect(getMetadata).toBeCalledTimes(1);
        expect(getMetadata).toBeCalledWith('123456');

        expect(getSlide).toBeCalledTimes(1);
        expect(getSlide).toBeCalledWith('123456', 0);

        await wrapper.getComponent(ButtonComponent).vm.$emit('click');

        expect(routerMock.push).toBeCalledTimes(1);
    });
});
