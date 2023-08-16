import { SequenceRestInterface } from '../../../frontend/src/restInterfaces/SequenceRestInterface';
import { vi } from 'vitest';
import axios from 'axios';
import { LayoutSlot, LayoutType } from '../../../model/slide/layout/Layout';
import { ContentType } from '../../../model/slide/content/Content';
import { EmbedContent } from '../../../model/slide/content/EmbedContent';

describe('SequenceRestInterface', () => {
    beforeAll(() => {
        vi.mock('axios');
    });

    test('addSequence', async () => {
        axios.put = vi.fn().mockResolvedValue({ data: { code: 'ABC123' } });
        const result = await SequenceRestInterface.addSequence('test');

        expect(axios.put).toBeCalledWith(
            'http://localhost:5000/api/sequence/',
            { name: 'test' },
            { withCredentials: true }
        );
        expect(result).toBe('ABC123');
    });

    test('updateSequence', async () => {
        axios.patch = vi.fn().mockResolvedValue({ data: {} });
        await SequenceRestInterface.updateSequence({
            code: 'test',
            slides: [],
            slideCount: 10,
            name: 'test123',
        });

        expect(axios.patch).toBeCalledWith(
            'http://localhost:5000/api/sequence/',
            { code: 'test', slides: [], slideCount: 10, name: 'test123' },
            { withCredentials: true }
        );
    });

    test('deleteSequence', async () => {
        axios.delete = vi.fn().mockResolvedValue({ data: {} });
        await SequenceRestInterface.deleteSequence('test');

        expect(axios.delete).toBeCalledWith(
            'http://localhost:5000/api/sequence/',
            {
                data: { code: 'test' },
                withCredentials: true,
            }
        );
    });

    test('getSequence', async () => {
        axios.get = vi.fn().mockResolvedValue({
            data: {
                code: 'ABC123',
                name: 'test123',
                slides: [
                    {
                        id: 0,
                        content: {
                            [LayoutSlot.MAIN]: {
                                contentType: ContentType.EMBED,
                                url: 'loernwerk.de',
                            },
                        },
                        layout: LayoutType.SINGLE_COLUMN,
                        backgroundColor: '#FFFFFF',
                        sequenceCode: 'ABC123',
                        order: 1,
                    },
                ],
                authorId: 123,
                writeAccess: [],
                readAccess: [2, 3],
                slideCount: 1,
                creationDate: new Date(),
                modificationDate: new Date(),
                tags: ['tag'],
            },
        });
        const result = await SequenceRestInterface.getSequence('ABC123');

        expect(axios.get).toBeCalledWith(
            'http://localhost:5000/api/sequence/ABC123/edit',
            {
                withCredentials: true,
            }
        );
        expect(result.code).toBe('ABC123');
        expect(result.name).toBe('test123');
        expect(result.authorId).toBe(123);
        expect(result.writeAccess).toStrictEqual([]);
        expect(result.readAccess).toStrictEqual([2, 3]);
        expect(result.slideCount).toBe(1);
        expect(result.tags).toStrictEqual(['tag']);

        expect(result.slides.length).toBe(1);
        expect(result.slides[0].id).toBe(0);
        expect(
            result.slides[0].content[LayoutSlot.MAIN]?.contentType
        ).toStrictEqual(ContentType.EMBED);
        expect(
            (result.slides[0].content[LayoutSlot.MAIN] as EmbedContent).url
        ).toBe('loernwerk.de');
        expect(result.slides[0].layout).toBe(LayoutType.SINGLE_COLUMN);
        expect(result.slides[0].backgroundColor).toBe('#FFFFFF');
        expect(result.slides[0].sequenceCode).toBe('ABC123');
        expect(result.slides[0].order).toBe(1);
    });

    test('getOwnSequences', async () => {
        axios.get = vi.fn().mockResolvedValue({
            data: [
                {
                    code: 'ABC123',
                    name: 'test123',
                    authorId: 123,
                    writeAccess: [],
                    readAccess: [2, 3],
                    slideCount: 10,
                    creationDate: new Date(),
                    modificationDate: new Date(),
                    tags: ['tag'],
                },
                {
                    code: '123ABC',
                    name: 'test456',
                    authorId: 123,
                    writeAccess: [],
                    readAccess: [2],
                    slideCount: 9,
                    creationDate: new Date(),
                    modificationDate: new Date(),
                    tags: [],
                },
            ],
        });
        const result = await SequenceRestInterface.getOwnSequences();

        expect(axios.get).toBeCalledWith(
            'http://localhost:5000/api/sequence/list',
            {
                withCredentials: true,
            }
        );
        expect(result.length).toBe(2);
        expect(result[0].code).toBe('ABC123');
        expect(result[0].name).toBe('test123');
        expect(result[0].authorId).toBe(123);
        expect(result[0].writeAccess).toStrictEqual([]);
        expect(result[0].readAccess).toStrictEqual([2, 3]);
        expect(result[0].slideCount).toBe(10);
        expect(result[0].tags).toStrictEqual(['tag']);

        expect(result[1].code).toBe('123ABC');
        expect(result[1].name).toBe('test456');
        expect(result[1].authorId).toBe(123);
        expect(result[1].writeAccess).toStrictEqual([]);
        expect(result[1].readAccess).toStrictEqual([2]);
        expect(result[1].slideCount).toBe(9);
        expect(result[1].tags).toStrictEqual([]);
    });

    test('getSequencesByUser', async () => {
        axios.get = vi.fn().mockResolvedValue({
            data: [
                {
                    code: 'ABC123',
                    name: 'test123',
                    authorId: 123,
                    writeAccess: [],
                    readAccess: [2, 3],
                    slideCount: 10,
                    creationDate: new Date(),
                    modificationDate: new Date(),
                    tags: ['tag'],
                },
                {
                    code: '123ABC',
                    name: 'test456',
                    authorId: 123,
                    writeAccess: [],
                    readAccess: [2],
                    slideCount: 9,
                    creationDate: new Date(),
                    modificationDate: new Date(),
                    tags: [],
                },
            ],
        });
        const result = await SequenceRestInterface.getSequenceByUser(123);

        expect(axios.get).toBeCalledWith(
            'http://localhost:5000/api/sequence/list/123',
            {
                withCredentials: true,
            }
        );
        expect(result.length).toBe(2);
        expect(result[0].code).toBe('ABC123');
        expect(result[0].name).toBe('test123');
        expect(result[0].authorId).toBe(123);
        expect(result[0].writeAccess).toStrictEqual([]);
        expect(result[0].readAccess).toStrictEqual([2, 3]);
        expect(result[0].slideCount).toBe(10);
        expect(result[0].tags).toStrictEqual(['tag']);

        expect(result[1].code).toBe('123ABC');
        expect(result[1].name).toBe('test456');
        expect(result[1].authorId).toBe(123);
        expect(result[1].writeAccess).toStrictEqual([]);
        expect(result[1].readAccess).toStrictEqual([2]);
        expect(result[1].slideCount).toBe(9);
        expect(result[1].tags).toStrictEqual([]);
    });

    test('getSequencesByUser', async () => {
        axios.get = vi.fn().mockResolvedValue({
            data: [
                {
                    code: 'ABC123',
                    name: 'test123',
                    authorId: 123,
                    writeAccess: [2, 3],
                    readAccess: [],
                    slideCount: 10,
                    creationDate: new Date(),
                    modificationDate: new Date(),
                    tags: ['tag'],
                },
                {
                    code: '123ABC',
                    name: 'test456',
                    authorId: 123,
                    writeAccess: [],
                    readAccess: [2],
                    slideCount: 9,
                    creationDate: new Date(),
                    modificationDate: new Date(),
                    tags: [],
                },
            ],
        });
        const result = await SequenceRestInterface.getSequencesSharedWithYou();

        expect(axios.get).toBeCalledWith(
            'http://localhost:5000/api/sequence/list/shared',
            {
                withCredentials: true,
            }
        );
        expect(result.length).toBe(2);
        expect(result[0].code).toBe('ABC123');
        expect(result[0].name).toBe('test123');
        expect(result[0].authorId).toBe(123);
        expect(result[0].writeAccess).toStrictEqual([2, 3]);
        expect(result[0].readAccess).toStrictEqual([]);
        expect(result[0].slideCount).toBe(10);
        expect(result[0].tags).toStrictEqual(['tag']);

        expect(result[1].code).toBe('123ABC');
        expect(result[1].name).toBe('test456');
        expect(result[1].authorId).toBe(123);
        expect(result[1].writeAccess).toStrictEqual([]);
        expect(result[1].readAccess).toStrictEqual([2]);
        expect(result[1].slideCount).toBe(9);
        expect(result[1].tags).toStrictEqual([]);
    });

    test('getMetadataForStudent', async () => {
        axios.get = vi.fn().mockResolvedValue({
            data: {
                code: 'ABC123',
                name: 'test123',
                slideCount: 10,
            },
        });
        const result = await SequenceRestInterface.getMetadataForStudent(
            'ABC123'
        );

        expect(axios.get).toBeCalledWith(
            'http://localhost:5000/api/sequence/ABC123/view',
            {
                withCredentials: true,
            }
        );
        expect(result.code).toBe('ABC123');
        expect(result.name).toBe('test123');
        expect(result.slideCount).toBe(10);
    });
});
