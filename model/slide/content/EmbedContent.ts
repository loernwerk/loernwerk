import { Content, ContentType } from './Content';

/**
 * Embeded html content as object
 */
export class EmbedContent extends Content {
    /** URL link to embed content */
    url: string;

    /**
     * @inheritDoc
     */
    constructor() {
        super(ContentType.EMBED);
    }
}
