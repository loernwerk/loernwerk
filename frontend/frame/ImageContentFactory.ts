import { ImageContent } from '../../model/slide/content/ImageContent';
import { ContentFactory } from './ContentFactory';
/**
 * Class which transforms JSON to ImageContent Object
 */
export class ImageContentFactory extends ContentFactory {
  /**
   * Factory-Object,transforms JSON to ImageContent Object
   * @param json the JSON sent by the Webserver
   * @returns the imageContent as ImageContent type
   * @protected
   */
  public buildContent(json: unknown): ImageContent {
    const imageContent = new ImageContent();
    imageContent.img = (json as ImageContent).img;
    imageContent.scale = (json as ImageContent).scale;
    return imageContent;
  }
}
