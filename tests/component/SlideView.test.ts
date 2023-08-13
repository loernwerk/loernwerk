import { defineComponent } from "vue";
import SlideView from "../../frontend/src/views/SlideView.vue"
import { SequenceRestInterface } from '../../frontend/src/restInterfaces/SequenceRestInterface';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, test, vi } from 'vitest';
import { ISequence } from "../../model/sequence/ISequence";
import { routerMock } from './router_mock.setup';

describe("SlideView", () => {

    const SuspenseSlideView = defineComponent({
        components: { SlideView },
        template: '<Suspense><SlideView :sequenceCode="code" /></Suspense>',
        props: {
            code: String
        }
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
        const wrapper = mount(SuspenseSlideView, {
            props: {
                code: "123456"
            }
        })

        await flushPromises()

        expect(getMetadata).toBeCalledTimes(1)
        expect(getMetadata).toBeCalledWith("123456")

    })

    test("correct follow up calls", async () => {
        const getMetadata = vi.spyOn(SequenceRestInterface, "getMetadataForStudent")
        const getSlide = vi.spyOn(SequenceRestInterface, "getSlide")

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
                    slideCount: 2
                }
            })
        })

        getSlide.mockImplementation((sequenceCode:string, slideIndex:number) => {
            return new Promise(() => {
                return {}
            })
        })

        const wrapper = mount(SuspenseSlideView, {
            props: {
                code: "123456"
            }
        })

        await flushPromises()

        expect(getMetadata).toBeCalledTimes(1)
        expect(getMetadata).toBeCalledWith("123456")

        expect(routerMock.push).toBeCalledTimes(0)

        expect(getSlide).toBeCalledTimes(1)
        expect(getSlide).toBeCalledWith("123456", 0)

    })

})