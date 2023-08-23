import { mount } from '@vue/test-utils';
import { describe, test } from 'vitest';
import SlideDisplayFactory from '../../../frontend/src/components/contentDisplay/SlideDisplayFactory.vue';
import { LayoutSlot, LayoutType } from '../../../model/slide/layout/Layout';
import { ContentType } from '../../../model/slide/content/Content';
import ContentDisplayFactoryVue from '../../../frontend/src/components/contentDisplay/ContentDisplayFactory.vue';
import { EmbedContent } from '../../../model/slide/content/EmbedContent';

describe('SlideDisplayFactory', () => {
    test('Correct background', async () => {
        const wrapper = mount(SlideDisplayFactory, {
            props: {
                slide: {
                    layout: LayoutType.TITLEPAGE,
                    content: {},
                    backgroundColor: '#00FF00',
                    sequenceCode: 'ABCDEF',
                    order: 1,
                    id: 1,
                },
                editMode: false,
            },
        });

        expect(
            wrapper
                .find('div.aspect-video.h-full.p-5.rounded-md')
                .attributes('style')
        ).toBe('background-color: rgb(0, 255, 0);');
    });
    test('Correct Layout.Titlepage', async () => {
        const wrapper = mount(SlideDisplayFactory, {
            props: {
                slide: {
                    layout: LayoutType.TITLEPAGE,
                    content: {
                        [LayoutSlot.MAIN]: {
                            contentType: ContentType.EMBED,
                            url: 'https://www.youtube.com/embed/dsHyUgGMht0',
                        } as EmbedContent,
                    },
                    backgroundColor: '#00FF00',
                    sequenceCode: 'ABCDEF',
                    order: 1,
                    id: 1,
                },
                editMode: false,
            },
        });

        expect(wrapper.findAllComponents(ContentDisplayFactoryVue).length).toBe(
            1
        );
        expect(
            wrapper.findComponent(ContentDisplayFactoryVue).props('layoutSlot')
        ).toBe(LayoutSlot.MAIN);
        expect(
            wrapper.findComponent(ContentDisplayFactoryVue).props('content')
        ).toEqual({
            contentType: ContentType.EMBED,
            url: 'https://www.youtube.com/embed/dsHyUgGMht0',
        });
        expect(
            wrapper.findComponent(ContentDisplayFactoryVue).attributes('style')
        ).toBe(
            'grid-row-start: 2; grid-row-end: 3; grid-column-start: 1; grid-column-end: 3;'
        );
    });
    test('Correct Layout.SINGLE_COLUMN_WITH_HEADER', async () => {
        const wrapper = mount(SlideDisplayFactory, {
            props: {
                slide: {
                    layout: LayoutType.SINGLE_COLUMN_WITH_HEADER,
                    content: {
                        [LayoutSlot.HEADER]: {
                            contentType: ContentType.EMBED,
                            url: 'HEADER-url',
                        } as EmbedContent,
                        [LayoutSlot.MAIN]: {
                            contentType: ContentType.EMBED,
                            url: 'MAIN-url',
                        } as EmbedContent,
                    },
                    backgroundColor: '#00FF00',
                    sequenceCode: 'ABCDEF',
                    order: 1,
                    id: 1,
                },
                editMode: false,
            },
        });

        expect(wrapper.findAllComponents(ContentDisplayFactoryVue).length).toBe(
            2
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .props('layoutSlot')
        ).toBe(LayoutSlot.HEADER);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'HEADER-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .attributes('style')
        ).toBe(
            'grid-row-start: 1; grid-row-end: 2; grid-column-start: 1; grid-column-end: 3;'
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .props('layoutSlot')
        ).toBe(LayoutSlot.MAIN);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'MAIN-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .attributes('style')
        ).toBe(
            'grid-row-start: 2; grid-row-end: 4; grid-column-start: 1; grid-column-end: 3;'
        );
    });
    test('Correct Layout.SINGLE_COLUMN', async () => {
        const wrapper = mount(SlideDisplayFactory, {
            props: {
                slide: {
                    layout: LayoutType.SINGLE_COLUMN,
                    content: {
                        [LayoutSlot.MAIN]: {
                            contentType: ContentType.EMBED,
                            url: 'MAIN-url',
                        } as EmbedContent,
                    },
                    backgroundColor: '#00FF00',
                    sequenceCode: 'ABCDEF',
                    order: 1,
                    id: 1,
                },
                editMode: false,
            },
        });

        expect(wrapper.findAllComponents(ContentDisplayFactoryVue).length).toBe(
            1
        );
        expect(
            wrapper.findComponent(ContentDisplayFactoryVue).props('layoutSlot')
        ).toBe(LayoutSlot.MAIN);
        expect(
            wrapper.findComponent(ContentDisplayFactoryVue).props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'MAIN-url' });
        expect(
            wrapper.findComponent(ContentDisplayFactoryVue).attributes('style')
        ).toBe(
            'grid-row-start: 2; grid-row-end: 4; grid-column-start: 1; grid-column-end: 3;'
        );
    });
    test('Correct Layout.TWO_COLUMN_WITH_HEADER', async () => {
        const wrapper = mount(SlideDisplayFactory, {
            props: {
                slide: {
                    layout: LayoutType.TWO_COLUMN_WITH_HEADER,
                    content: {
                        [LayoutSlot.HEADER]: {
                            contentType: ContentType.EMBED,
                            url: 'HEADER-url',
                        } as EmbedContent,
                        [LayoutSlot.MAIN]: {
                            contentType: ContentType.EMBED,
                            url: 'MAIN-url',
                        } as EmbedContent,
                        [LayoutSlot.SECONDARY]: {
                            contentType: ContentType.EMBED,
                            url: 'SECONDARY-url',
                        } as EmbedContent,
                    },
                    backgroundColor: '#00FF00',
                    sequenceCode: 'ABCDEF',
                    order: 1,
                    id: 1,
                },
                editMode: false,
            },
        });

        expect(wrapper.findAllComponents(ContentDisplayFactoryVue).length).toBe(
            3
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .props('layoutSlot')
        ).toBe(LayoutSlot.HEADER);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'HEADER-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .attributes('style')
        ).toBe(
            'grid-row-start: 1; grid-row-end: 2; grid-column-start: 1; grid-column-end: 3;'
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .props('layoutSlot')
        ).toBe(LayoutSlot.MAIN);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'MAIN-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .attributes('style')
        ).toBe(
            'grid-row-start: 2; grid-row-end: 4; grid-column-start: 1; grid-column-end: 2;'
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[2]
                .props('layoutSlot')
        ).toBe(LayoutSlot.SECONDARY);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[2]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'SECONDARY-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[2]
                .attributes('style')
        ).toBe(
            'grid-row-start: 2; grid-row-end: 4; grid-column-start: 2; grid-column-end: 3;'
        );
    });
    test('Correct Layout.TWO_COLUMN', async () => {
        const wrapper = mount(SlideDisplayFactory, {
            props: {
                slide: {
                    layout: LayoutType.TWO_COLUMN,
                    content: {
                        [LayoutSlot.MAIN]: {
                            contentType: ContentType.EMBED,
                            url: 'MAIN-url',
                        } as EmbedContent,
                        [LayoutSlot.SECONDARY]: {
                            contentType: ContentType.EMBED,
                            url: 'SECONDARY-url',
                        } as EmbedContent,
                    },
                    backgroundColor: '#00FF00',
                    sequenceCode: 'ABCDEF',
                    order: 1,
                    id: 1,
                },
                editMode: false,
            },
        });

        expect(wrapper.findAllComponents(ContentDisplayFactoryVue).length).toBe(
            2
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .props('layoutSlot')
        ).toBe(LayoutSlot.MAIN);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'MAIN-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .attributes('style')
        ).toBe(
            'grid-row-start: 2; grid-row-end: 4; grid-column-start: 1; grid-column-end: 2;'
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .props('layoutSlot')
        ).toBe(LayoutSlot.SECONDARY);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'SECONDARY-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .attributes('style')
        ).toBe(
            'grid-row-start: 2; grid-row-end: 4; grid-column-start: 2; grid-column-end: 3;'
        );
    });
    test('Correct Layout.GRID_WITH_HEADER', async () => {
        const wrapper = mount(SlideDisplayFactory, {
            props: {
                slide: {
                    layout: LayoutType.GRID_WITH_HEADER,
                    content: {
                        [LayoutSlot.HEADER]: {
                            contentType: ContentType.EMBED,
                            url: 'HEADER-url',
                        } as EmbedContent,
                        [LayoutSlot.MAIN]: {
                            contentType: ContentType.EMBED,
                            url: 'MAIN-url',
                        } as EmbedContent,
                        [LayoutSlot.SECONDARY]: {
                            contentType: ContentType.EMBED,
                            url: 'SECONDARY-url',
                        } as EmbedContent,
                        [LayoutSlot.TERTIARY]: {
                            contentType: ContentType.EMBED,
                            url: 'TERTIARY-url',
                        } as EmbedContent,
                        [LayoutSlot.FOURARY]: {
                            contentType: ContentType.EMBED,
                            url: 'FOURARY-url',
                        } as EmbedContent,
                    },
                    backgroundColor: '#00FF00',
                    sequenceCode: 'ABCDEF',
                    order: 1,
                    id: 1,
                },
                editMode: false,
            },
        });

        expect(wrapper.findAllComponents(ContentDisplayFactoryVue).length).toBe(
            5
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .props('layoutSlot')
        ).toBe(LayoutSlot.HEADER);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'HEADER-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .attributes('style')
        ).toBe(
            'grid-row-start: 1; grid-row-end: 2; grid-column-start: 1; grid-column-end: 3;'
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .props('layoutSlot')
        ).toBe(LayoutSlot.MAIN);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'MAIN-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .attributes('style')
        ).toBe(
            'grid-row-start: 2; grid-row-end: 3; grid-column-start: 1; grid-column-end: 2;'
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[2]
                .props('layoutSlot')
        ).toBe(LayoutSlot.SECONDARY);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[2]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'SECONDARY-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[2]
                .attributes('style')
        ).toBe(
            'grid-row-start: 2; grid-row-end: 3; grid-column-start: 2; grid-column-end: 3;'
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[3]
                .props('layoutSlot')
        ).toBe(LayoutSlot.TERTIARY);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[3]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'TERTIARY-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[3]
                .attributes('style')
        ).toBe(
            'grid-row-start: 3; grid-row-end: 4; grid-column-start: 1; grid-column-end: 2;'
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[4]
                .props('layoutSlot')
        ).toBe(LayoutSlot.FOURARY);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[4]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'FOURARY-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[4]
                .attributes('style')
        ).toBe(
            'grid-row-start: 3; grid-row-end: 4; grid-column-start: 2; grid-column-end: 3;'
        );
    });
    test('Correct Layout.GRID', async () => {
        const wrapper = mount(SlideDisplayFactory, {
            props: {
                slide: {
                    layout: LayoutType.GRID,
                    content: {
                        [LayoutSlot.MAIN]: {
                            contentType: ContentType.EMBED,
                            url: 'MAIN-url',
                        } as EmbedContent,
                        [LayoutSlot.SECONDARY]: {
                            contentType: ContentType.EMBED,
                            url: 'SECONDARY-url',
                        } as EmbedContent,
                        [LayoutSlot.TERTIARY]: {
                            contentType: ContentType.EMBED,
                            url: 'TERTIARY-url',
                        } as EmbedContent,
                        [LayoutSlot.FOURARY]: {
                            contentType: ContentType.EMBED,
                            url: 'FOURARY-url',
                        } as EmbedContent,
                    },
                    backgroundColor: '#00FF00',
                    sequenceCode: 'ABCDEF',
                    order: 1,
                    id: 1,
                },
                editMode: false,
            },
        });

        expect(wrapper.findAllComponents(ContentDisplayFactoryVue).length).toBe(
            4
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .props('layoutSlot')
        ).toBe(LayoutSlot.MAIN);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'MAIN-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .attributes('style')
        ).toBe(
            'grid-row-start: 2; grid-row-end: 3; grid-column-start: 1; grid-column-end: 2;'
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .props('layoutSlot')
        ).toBe(LayoutSlot.SECONDARY);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'SECONDARY-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .attributes('style')
        ).toBe(
            'grid-row-start: 2; grid-row-end: 3; grid-column-start: 2; grid-column-end: 3;'
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[2]
                .props('layoutSlot')
        ).toBe(LayoutSlot.TERTIARY);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[2]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'TERTIARY-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[2]
                .attributes('style')
        ).toBe(
            'grid-row-start: 3; grid-row-end: 4; grid-column-start: 1; grid-column-end: 2;'
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[3]
                .props('layoutSlot')
        ).toBe(LayoutSlot.FOURARY);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[3]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'FOURARY-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[3]
                .attributes('style')
        ).toBe(
            'grid-row-start: 3; grid-row-end: 4; grid-column-start: 2; grid-column-end: 3;'
        );
    });
    test('Correct Layout.SIDEBAR', async () => {
        const wrapper = mount(SlideDisplayFactory, {
            props: {
                slide: {
                    layout: LayoutType.SIDEBAR,
                    content: {
                        [LayoutSlot.HEADER]: {
                            contentType: ContentType.EMBED,
                            url: 'HEADER-url',
                        } as EmbedContent,
                        [LayoutSlot.MAIN]: {
                            contentType: ContentType.EMBED,
                            url: 'MAIN-url',
                        } as EmbedContent,
                        [LayoutSlot.SECONDARY]: {
                            contentType: ContentType.EMBED,
                            url: 'SECONDARY-url',
                        } as EmbedContent,
                    },
                    backgroundColor: '#00FF00',
                    sequenceCode: 'ABCDEF',
                    order: 1,
                    id: 1,
                },
                editMode: false,
            },
        });

        expect(wrapper.findAllComponents(ContentDisplayFactoryVue).length).toBe(
            3
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .props('layoutSlot')
        ).toBe(LayoutSlot.HEADER);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'HEADER-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[0]
                .attributes('style')
        ).toBe(
            'grid-row-start: 1; grid-row-end: 2; grid-column-start: 1; grid-column-end: 2;'
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .props('layoutSlot')
        ).toBe(LayoutSlot.MAIN);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'MAIN-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[1]
                .attributes('style')
        ).toBe(
            'grid-row-start: 1; grid-row-end: 4; grid-column-start: 2; grid-column-end: 3;'
        );

        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[2]
                .props('layoutSlot')
        ).toBe(LayoutSlot.SECONDARY);
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[2]
                .props('content')
        ).toEqual({ contentType: ContentType.EMBED, url: 'SECONDARY-url' });
        expect(
            wrapper
                .findAllComponents(ContentDisplayFactoryVue)[2]
                .attributes('style')
        ).toBe(
            'grid-row-start: 2; grid-row-end: 4; grid-column-start: 1; grid-column-end: 2;'
        );
    });
});
