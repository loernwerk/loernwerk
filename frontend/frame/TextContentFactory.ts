import { TextContent } from '../../model/slide/content/TextContent';
import { ContentFactory } from './ContentFactory';

/**
 * Class which transforms JSON to TextContent Object
 */
export class TextContentFactory extends ContentFactory {
  /**
   * Factory-Object,transforms JSON to TextContent Object
   * @param json the JSON sent by the Webserver
   * @returns the textContent as TextContent type
   * @protected
   */
  public buildContent(json: unknown): TextContent {
    const textContent = new TextContent();
    textContent.alignmentHorizontal = (json as TextContent).alignmentHorizontal;
    textContent.alignmentVertical = (json as TextContent).alignmentVertical;
    textContent.textSnippets = (json as TextContent).textSnippets;
    return textContent;
  }
}
