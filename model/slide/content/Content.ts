/**
 * Abstract content object.
 */
export abstract class Content {
    /** Type of this content */
    type: ContentType;
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
