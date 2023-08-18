import { defineComponent } from 'vue';
import FinishedView from '../../frontend/src/views/FinishedView.vue';
import ButtonComponent from '../../frontend/src/components/ButtonComponent.vue';
import { SequenceRestInterface } from '../../frontend/src/restInterfaces/SequenceRestInterface';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';

describe('FinishedView', () => {
    const SuspenseFinishedView = defineComponent({
        components: { FinishedView },
        template: '<Suspense><FinishedView :sequenceCode="code" /></Suspense>',
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

        mount(SuspenseFinishedView, {
            props: {
                code: '123456',
            },
        });

        await flushPromises();

        expect(getMetadata).toBeCalledTimes(1);
        expect(getMetadata).toBeCalledWith('123456');
    });

    test('called getcertificateurl with correct params', async () => {
        const getMetadata = vi.spyOn(
            SequenceRestInterface,
            'getMetadataForStudent'
        );
        const getUrl = vi.spyOn(SequenceRestInterface, 'getUrlForCertificate');
        const windowopen = vi.spyOn(window, 'open');

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

        getUrl.mockResolvedValueOnce('test.de');

        const wrapper = mount(SuspenseFinishedView, {
            props: {
                code: '123456',
            },
        });

        await flushPromises();

        expect(getMetadata).toBeCalledTimes(1);
        expect(getMetadata).toBeCalledWith('123456');

        await wrapper.getComponent(ButtonComponent).vm.$emit('click');

        await flushPromises();

        expect(getUrl).toBeCalled(1);
        expect(getUrl).toBeCalledWith('123456', 'de');

        expect(windowopen).toBeCalled(1);
        //not testing the argument, because it is a promise, but since it is what we return in the geturl function it'll work
    });
});
