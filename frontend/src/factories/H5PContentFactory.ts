import { H5PContent } from '../../../model/slide/content/H5PContent';
import { ContentFactory } from './ContentFactory';

/**
 * Class which transforms JSON to H5PContent Object
 */
export class H5PContentFactory extends ContentFactory {
  /**
   * @inheritDoc
   * @param json the JSON
   * @returns json as H5PContent
   * @protected
   */
  public buildContent(json: unknown): H5PContent {
    const h5pContent = new H5PContent();
    h5pContent.h5pContentId = (json as H5PContent).h5pContentId;
    return h5pContent;
  }
}
