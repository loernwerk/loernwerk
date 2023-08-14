import { defineComponent } from "vue";
import FinishedView from "../../frontend/src/views/FinishedView.vue"
import ButtonComponent from "../../frontend/src/components/ButtonComponent.vue"
import { SequenceRestInterface } from '../../frontend/src/restInterfaces/SequenceRestInterface';
import { flushPromises, mount, shallowMount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import { routerMock } from './router_mock.setup';
import { G } from "vitest/dist/types-198fd1d9";

describe("SlideView", () => {

    const SuspenseFinishedView = defineComponent({
        components: { FinishedView },
        template: '<Suspense><FinishedView :sequenceCode="code" /></Suspense>',
        props: {
            code: String
        }
    });

    const test2 = defineComponent({
        components: { ButtonComponent },
        template: '<ButtonComponent class="w-fit" @click="downloadCertificate()">  $t(finished.certificate) </ButtonComponent>'
    });
    
    test("correct Sequence fetch call", async () => {
        const getMetadata = vi.spyOn(SequenceRestInterface, "getMetadataForStudent")
        getMetadata.mockImplementation( (code) => {
            return new Promise(() => {
                return {
                    name: "test",
                    code: code,
                    creationDate: new Date(),
                    modificationDate: new Date(),
                    authorId: 1,
                    writeAccess: [],
                    readAccess: [],
                    tags: [],
                    slideCount: 1
                }
            })
        })
        const wrapper = mount(SuspenseFinishedView, {
            props: {
                code: "123456"
            }
        })

        await flushPromises()

        expect(getMetadata).toBeCalledTimes(1)
        expect(getMetadata).toBeCalledWith("123456")

    })

    test("called getcertificateurl with correct params", async () => {
        const getMetadata = vi.spyOn(SequenceRestInterface, "getMetadataForStudent")
        const getUrl = vi.spyOn(SequenceRestInterface, "getUrlForCertificate")

        getMetadata.mockImplementation( (code) => {
            return new Promise(() => {
                return {
                    name: "test",
                    code: code,
                    creationDate: new Date(),
                    modificationDate: new Date(),
                    authorId: 1,
                    writeAccess: [],
                    readAccess: [],
                    tags: [],
                    slideCount: 1
                }
            })
        })

        getUrl.mockImplementation( (sequenceCode: string, language: string) => {
            return "test.de"
        })

        const wrapper = mount(SuspenseFinishedView, {
            props: {
                code: "123456"
            }
        })

        await flushPromises()

        expect(getMetadata).toBeCalledTimes(1)
        expect(getMetadata).toBeCalledWith("123456")

        await wrapper.getComponent(ButtonComponent).vm.$emit("click")

        await flushPromises()

        expect(getUrl).toBeCalled(1)
        expect(getUrl).toBeCalledWith("123456")
    })


})