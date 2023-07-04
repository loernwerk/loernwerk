import { Content, ContentType } from '../../model/slide/content/Content';
import { EmbedContentFactory } from './EmbedContentFactory';
import { H5PContentFactory } from './H5PContentFactory';
import { ImageContentFactory } from './ImageContentFactory';
import { TextContentFactory } from './TextContentFactory';

/**
 * Base Class to convert JSON to Content objects
 */
export abstract class ContentFactory {
  /**
   * Converts JSON to Content Object
   * @param json the JSON sent by the Webserver
   * @returns a contentObject of the specified type
   */
  public static createContent(json: unknown): Content {
    let contentObject: Content;
    switch ((json as Content).type) {
      case ContentType.EMBED: {
        const eFactory = new EmbedContentFactory();
        contentObject = eFactory.buildContent(json);
        break;
      }

      case ContentType.H5P: {
        const hFactory = new H5PContentFactory();
        contentObject = hFactory.buildContent(json);
        break;
      }

      case ContentType.IMAGE: {
        const iFactory = new ImageContentFactory();
        contentObject = iFactory.buildContent(json);
        break;
      }

      case ContentType.TEXT: {
        const tFactory = new TextContentFactory();
        contentObject = tFactory.buildContent(json);
      }
    }

    return contentObject;
  }

  /**
   * Converts JSON to Content Object
   * @param json the JSON sent by the Webserver
   * @protected
   */

  protected abstract buildContent(json: unknown): Content;
}
