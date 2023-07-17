/**
 * Abstract content object.
 */
export abstract class Content {
    /** Type of this content */
    type: ContentType;

    /**
     * Constructor that sets the ContentType
     * @param type the ContentType
     * @protected
     */
    protected constructor(type: ContentType) {
        this.type = type;
    }
}

/**
 * Different types of content.
 */
export enum ContentType {
    /** Text content */
    TEXT,
    /** Image content */
    IMAGE,
    /** Embeded html content */
    EMBED,
    /** H5P content */
    H5P,
}
