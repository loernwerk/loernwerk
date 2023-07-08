import { TextContent } from '../../model/slide/content/TextContent';
import { ContentFactory } from './ContentFactory';

/**
 * Class which transforms JSON to TextContent Object
 */
export class TextContentFactory extends ContentFactory {
  /**
   * @inheritDoc
   * @param json the JSON
   * @returns the textContent as TextContent type
   * @protected
   */
  public buildContent(json: unknown): TextContent {
    const textContent = new TextContent();
    textContent.alignmentHorizontal = (json as TextContent).alignmentHorizontal;
    textContent.alignmentVertical = (json as TextContent).alignmentVertical;
    textContent.textSnippets = [];

    (json as TextContent).textSnippets.forEach((snippet) => {
      textContent.textSnippets.push(Object.assign({}, snippet));
    });
    return textContent;
  }
}
