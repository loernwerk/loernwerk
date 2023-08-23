import { ContentFactory } from '../../frontend/src/factories/ContentFactory';
import { H5PContent } from '../../model/slide/content/H5PContent';
import { EmbedContent } from '../../model/slide/content/EmbedContent';
import { ImageContent } from '../../model/slide/content/ImageContent';
import { TextContent } from '../../model/slide/content/TextContent';
import { ContentType } from '../../model/slide/content/Content';
describe('Factory-Tests', () => {
    const h5pJSON = {
        h5pContentId: 'string',
        contentType: ContentType.H5P,
    };
    const embedJSON = {
        url: 'string',
        contentType: ContentType.EMBED,
    };

    const imageJSON = {
        img: 'string',
        scale: 'number',
        contentType: ContentType.IMAGE,
    };

    const textJSON = {
        delta: 'ops : []',
        contentType: ContentType.TEXT,
    };

    it('h5p factory test', async () => {
        const h5p = ContentFactory.createContent(h5pJSON);
        expect(h5p).toBeInstanceOf(H5PContent);
        expect((h5p as H5PContent).h5pContentId).toEqual('string');
    });

    it('embed factory test', async () => {
        const embed = ContentFactory.createContent(embedJSON);
        expect(embed).toBeInstanceOf(EmbedContent);
        expect((embed as EmbedContent).url).toEqual('string');
    });

    it('image factory test', async () => {
        const image = ContentFactory.createContent(imageJSON);
        expect(image).toBeInstanceOf(ImageContent);
        expect((image as ImageContent).img).toEqual('string');
        expect((image as ImageContent).scale).toEqual('number');
    });

    it('text factory test', async () => {
        const text = ContentFactory.createContent(textJSON);
        expect(text).toBeInstanceOf(TextContent);
        expect((text as TextContent).delta.ops).toEqual([]);
    });
});
