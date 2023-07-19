import { ContentFactory } from '../frontend/src/factories/ContentFactory';
import { H5PContent } from '../model/slide/content/H5PContent';
import { EmbedContent } from '../model/slide/content/EmbedContent';
import { ImageContent } from '../model/slide/content/ImageContent';
import { TextContent } from '../model/slide/content/TextContent';
describe('Factory-Tests', () => {
    const h5pJSON = require('./test-json/H5PasJSON.json');
    const embedJSON = require('./test-json/embedAsJSON.json');
    const imageJSON = require('./test-json/imageAsJSON.json');
    const textJSON = require('./test-json/textAsJSON.json');

    it('h5p factory test', async () => {
        const h5p = ContentFactory.createContent(h5pJSON);
        expect(h5p).toBeInstanceOf(H5PContent);
    });

    it('embed factory test', async () => {
        const embed = ContentFactory.createContent(embedJSON);
        expect(embed).toBeInstanceOf(EmbedContent);
    });

    it('image factory test', async () => {
        const image = ContentFactory.createContent(imageJSON);
        expect(image).toBeInstanceOf(ImageContent);
    });

    it('text factory test', async () => {
        const text = ContentFactory.createContent(textJSON);
        expect(text).toBeInstanceOf(TextContent);
    });
});
