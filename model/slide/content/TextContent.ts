import { Content, ContentType } from './Content';
import Delta from 'quill-delta';

/**
 * Text content as an object.
 */
export class TextContent extends Content {
    /** Quill content */
    delta: Delta;

    /**
     * @inheritDoc
     */
    constructor() {
        super(ContentType.TEXT);
    }
}
