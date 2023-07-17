import { Content, ContentType } from './Content';

/**
 * Image content as object
 */
export class ImageContent extends Content {
    /** Image encoded as base64 string */
    img: string;
    /** Image scaling */
    scale: number;

    /**
     * @inheritDoc
     */
    constructor() {
        super(ContentType.IMAGE);
    }
}
