import { Content, ContentType } from '../../../model/slide/content/Content';
import { EmbedContentFactory } from './EmbedContentFactory';
import { H5PContentFactory } from './H5PContentFactory';
import { ImageContentFactory } from './ImageContentFactory';
import { TextContentFactory } from './TextContentFactory';
import {
  LoernwerkError,
  LoernwerkErrorCodes,
} from '../../../model/loernwerkError';

/**
 * Base Class to convert JSON to Content objects
 */
export abstract class ContentFactory {
  /**
   * Converts JSON to Content Object
   * @param json the JSON
   * @returns a contentObject of the specified type
   */
  public static createContent(json: unknown): Content {
    switch ((json as Content).contentType) {
      case ContentType.EMBED:
        return new EmbedContentFactory().buildContent(json);

      case ContentType.H5P:
        return new H5PContentFactory().buildContent(json);

      case ContentType.IMAGE:
        return new ImageContentFactory().buildContent(json);

      case ContentType.TEXT:
        return new TextContentFactory().buildContent(json);

      default:
        throw new LoernwerkError(
          `Not supported content type ${(json as Content).contentType}`,
          LoernwerkErrorCodes.NOT_FOUND
        );
    }
  }
}
