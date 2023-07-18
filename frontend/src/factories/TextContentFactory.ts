import { TextContent } from '../../../model/slide/content/TextContent';
import Delta from 'quill-delta';
import { AbstractContentFactory } from './AbstractContentFactory';

/**
 * Class which transforms JSON to TextContent Object
 */
export class TextContentFactory extends AbstractContentFactory {
  /**
   * @inheritDoc
   * @param json the JSON
   * @returns json as TextContent
   * @protected
   */
  public buildContent(json: unknown): TextContent {
    const textContent = new TextContent();
    textContent.delta = new Delta((json as TextContent).delta.ops);
    return textContent;
  }
}
