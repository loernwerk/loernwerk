import { Content } from '../../../model/slide/content/Content';

/**
 * Abstract content factory class
 */
export abstract class AbstractContentFactory {
  /**
   * Converts JSON to Content Object
   * @param json the JSON
   * @protected
   */
  protected abstract buildContent(json: unknown): Content;
}
