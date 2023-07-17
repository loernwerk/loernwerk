import { ImageContent } from '../../../model/slide/content/ImageContent';
import { ContentFactory } from './ContentFactory';
/**
 * Class which transforms JSON to ImageContent Object
 */
export class ImageContentFactory extends ContentFactory {
  /**
   * @inheritDoc
   * @param json the JSON
   * @returns json as ImageContent
   * @protected
   */
  public buildContent(json: unknown): ImageContent {
    const imageContent = new ImageContent();
    imageContent.img = (json as ImageContent).img;
    imageContent.scale = (json as ImageContent).scale;
    return imageContent;
  }
}
