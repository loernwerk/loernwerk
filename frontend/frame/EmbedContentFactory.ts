import { ContentFactory } from './ContentFactory';
import { EmbedContent } from '../../model/slide/content/EmbedContent';

/**
 * Class which transforms JSON to EmbedContent Object
 */
export class EmbedContentFactory extends ContentFactory {
  /**
   * Factory-Object,transforms JSON to EmbedContent Object
   * @param json the JSON sent by the Webserver
   * @returns the buildContent as BuildContent type
   * @protected
   */
  public buildContent(json: unknown): EmbedContent {
    const embedContent = new EmbedContent();
    embedContent.url = (json as EmbedContent).url;
    return embedContent;
  }
}
