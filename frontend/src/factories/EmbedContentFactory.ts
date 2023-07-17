import { AbstractContentFactory } from './AbstractContentFactory';
import { EmbedContent } from '../../../model/slide/content/EmbedContent';

/**
 * Class which transforms JSON to EmbedContent Object
 */
export class EmbedContentFactory extends AbstractContentFactory {
  /**
   * @inheritDoc
   * @param json the JSON
   * @returns json as EmbedContent
   * @protected
   */
  public buildContent(json: unknown): EmbedContent {
    const embedContent = new EmbedContent();
    embedContent.url = (json as EmbedContent).url;
    return embedContent;
  }
}
